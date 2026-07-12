using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using MangaWeb.Backend.Data;
using MangaWeb.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace MangaWeb.Backend.Services
{
    public class TelegramBotService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<TelegramBotService> _logger;
        private TelegramBotClient? _botClient;

        public TelegramBotService(
            IConfiguration configuration,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<TelegramBotService> logger)
        {
            _configuration = configuration;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var botToken = _configuration["Telegram:BotToken"];
            if (string.IsNullOrEmpty(botToken) || botToken == "YOUR_TELEGRAM_BOT_TOKEN_HERE")
            {
                _logger.LogWarning("Telegram Bot Token is not configured. Bot service will not start.");
                return;
            }

            _botClient = new TelegramBotClient(botToken);

            var receiverOptions = new ReceiverOptions
            {
                AllowedUpdates = Array.Empty<UpdateType>() // receive all update types
            };

            _logger.LogInformation("Starting Telegram Bot listener...");

            try
            {
                _botClient.StartReceiving(
                    updateHandler: HandleUpdateAsync,
                    pollingErrorHandler: HandlePollingErrorAsync,
                    receiverOptions: receiverOptions,
                    cancellationToken: stoppingToken
                );

                var me = await _botClient.GetMeAsync(stoppingToken);
                _logger.LogInformation($"Telegram Bot @{me.Username} is running successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to start Telegram Bot: {ex.Message}");
            }
        }

        private async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
        {
            // Only process Message updates and Text messages
            if (update.Type != UpdateType.Message || update.Message is not { } message || message.Text is not { } messageText)
                return;

            var chatId = message.Chat.Id;
            _logger.LogInformation($"Received message '{messageText}' in chat {chatId}.");

            var command = messageText.Trim();

            if (command.StartsWith("/start"))
            {
                var welcomeText = $"👋 Привет, {message.From?.FirstName ?? "друг"}!\n\n" +
                                  "Добро пожаловать в **MangaWeb Bot**! 📚\n\n" +
                                  "С моей помощью ты можешь искать мангу прямо в нашем каталоге!\n\n" +
                                  "📍 **Доступные команды:**\n" +
                                  "• `/manga` — Показать популярную мангу из БД\n" +
                                  "• `/search [название]` — Поиск манги в каталоге\n" +
                                  "• Или просто напиши название манги мне в чат!\n\n" +
                                  "🌐 Наш веб-сайт: http://localhost:5173";

                await botClient.SendTextMessageAsync(chatId, welcomeText, parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);
            }
            else if (command.StartsWith("/manga"))
            {
                await SendPopularMangaAsync(botClient, chatId, cancellationToken);
            }
            else if (command.StartsWith("/search"))
            {
                var query = command.Length > 7 ? command.Substring(7).Trim() : "";
                if (string.IsNullOrEmpty(query))
                {
                    await botClient.SendTextMessageAsync(chatId, "⚠️ Напишите название после команды, например: `/search One Piece`", parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);
                }
                else
                {
                    await SearchMangaAsync(botClient, chatId, query, cancellationToken);
                }
            }
            else
            {
                // Simple search by default text message
                await SearchMangaAsync(botClient, chatId, command, cancellationToken);
            }
        }

        private async Task SendPopularMangaAsync(ITelegramBotClient botClient, long chatId, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MangaDbContext>();
                try
                {
                    var mangas = await context.Mangas.OrderByDescending(m => m.Rating).Take(5).ToListAsync(cancellationToken);

                    if (!mangas.Any())
                    {
                        await botClient.SendTextMessageAsync(chatId, "📭 В каталоге базы данных пока нет манги.", cancellationToken: cancellationToken);
                        return;
                    }

                    await botClient.SendTextMessageAsync(chatId, "🔥 **Популярная манга в нашем каталоге:**", parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);

                    foreach (var manga in mangas)
                    {
                        var text = $"📚 *{manga.Title}*\n" +
                                   $"👤 Автор: {manga.Author}\n" +
                                   $"⭐️ Рейтинг: {manga.Rating.ToString("F1")}/5.0\n" +
                                   $"📖 Глав: {manga.Chapters}\n" +
                                   $"🏷 Жанры: {string.Join(", ", manga.Genres)}\n\n" +
                                   $"🔗 [Читать на MangaWeb](http://localhost:5173)";

                        await botClient.SendTextMessageAsync(chatId, text, parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Database error during /manga execution: {ex.Message}");
                    await botClient.SendTextMessageAsync(chatId, "❌ Произошла ошибка при обращении к базе данных.", cancellationToken: cancellationToken);
                }
            }
        }

        private async Task SearchMangaAsync(ITelegramBotClient botClient, long chatId, string query, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MangaDbContext>();
                try
                {
                    var mangas = await context.Mangas
                        .Where(m => m.Title.Contains(query) || m.Author.Contains(query))
                        .Take(5)
                        .ToListAsync(cancellationToken);

                    if (!mangas.Any())
                    {
                        await botClient.SendTextMessageAsync(chatId, $"🔍 По запросу \"{query}\" ничего не найдено.", cancellationToken: cancellationToken);
                        return;
                    }

                    await botClient.SendTextMessageAsync(chatId, $"🔎 **Результаты поиска по запросу \"{query}\":**", parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);

                    foreach (var manga in mangas)
                    {
                        var text = $"📚 *{manga.Title}*\n" +
                                   $"👤 Автор: {manga.Author}\n" +
                                   $"⭐️ Рейтинг: {manga.Rating.ToString("F1")}/5.0\n" +
                                   $"🏷 Жанры: {string.Join(", ", manga.Genres)}\n\n" +
                                   $"🔗 [Читать на MangaWeb](http://localhost:5173)";

                        await botClient.SendTextMessageAsync(chatId, text, parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Database error during search execution: {ex.Message}");
                    await botClient.SendTextMessageAsync(chatId, "❌ Произошла ошибка при поиске по базе данных.", cancellationToken: cancellationToken);
                }
            }
        }

        private Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
        {
            var errorMessage = exception switch
            {
                ApiRequestException apiRequestException
                    => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
                _ => exception.ToString()
            };

            _logger.LogError($"Bot polling error: {errorMessage}");
            return Task.CompletedTask;
        }
    }
}
