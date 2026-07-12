using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
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
        private readonly TelegramAuthStore _authStore;
        private TelegramBotClient? _botClient;

        public TelegramBotService(
            IConfiguration configuration,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<TelegramBotService> logger,
            TelegramAuthStore authStore)
        {
            _configuration = configuration;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _authStore = authStore;
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

            var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";

            if (command.StartsWith("/start"))
            {
                // Check if there's an auth code after /start
                var parts = command.Split(' ', 2);
                if (parts.Length > 1 && !string.IsNullOrWhiteSpace(parts[1]))
                {
                    var authCode = parts[1].Trim();
                    var telegramId = message.From?.Id ?? 0;
                    var username = message.From?.Username ?? $"tg_{telegramId}";
                    var firstName = message.From?.FirstName ?? "User";

                    var confirmed = _authStore.ConfirmCode(authCode, telegramId, username, firstName);

                    if (confirmed)
                    {
                        _logger.LogInformation($"Auth code '{authCode}' confirmed for Telegram user @{username} (ID: {telegramId})");
                        await botClient.SendTextMessageAsync(chatId,
                            $"✅ **Авторизация подтверждена!**\n\n" +
                            $"Привет, {firstName}! Ты успешно вошёл на MangaWeb.\n" +
                            $"Можешь вернуться на сайт — вход произойдёт автоматически. 🎉",
                            parseMode: ParseMode.Markdown, replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
                    }
                    else
                    {
                        await botClient.SendTextMessageAsync(chatId,
                            "❌ Код авторизации не найден или истёк.\n\nПопробуйте ещё раз на сайте.",
                            replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
                    }
                    return;
                }

                // Normal /start without auth code
                var welcomeText = $"👋 Привет, {message.From?.FirstName ?? "друг"}!\n\n" +
                                  "Добро пожаловать в **MangaWeb Bot**! 📚\n\n" +
                                  "Выбери действие в меню ниже или просто напиши название манги для поиска!";

                await botClient.SendTextMessageAsync(chatId, welcomeText, parseMode: ParseMode.Markdown, replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
            }
            else if (command.StartsWith("/manga") || command == "🔥 Топ популярного")
            {
                await SendPopularMangaAsync(botClient, chatId, frontendUrl, cancellationToken);
            }
            else if (command.StartsWith("/random") || command == "🎲 Случайная манга")
            {
                await SendRandomMangaAsync(botClient, chatId, frontendUrl, cancellationToken);
            }
            else if (command == "🔍 Поиск манги")
            {
                await botClient.SendTextMessageAsync(chatId, "⌨️ Напишите название манги в чат, и я найду её для вас!", cancellationToken: cancellationToken);
            }
            else if (command == "🌐 Ссылка на сайт")
            {
                var inlineKeyboard = new InlineKeyboardMarkup(
                    InlineKeyboardButton.WithUrl("Перейти на MangaWeb", frontendUrl)
                );
                await botClient.SendTextMessageAsync(chatId, $"Нажмите на кнопку ниже, чтобы перейти на сайт:", replyMarkup: inlineKeyboard, cancellationToken: cancellationToken);
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
                    await SearchMangaAsync(botClient, chatId, query, frontendUrl, cancellationToken);
                }
            }
            else
            {
                // Simple search by default text message
                await SearchMangaAsync(botClient, chatId, command, frontendUrl, cancellationToken);
            }
        }

        private IReplyMarkup GetMainMenuKeyboard()
        {
            return new ReplyKeyboardMarkup(new[]
            {
                new[]
                {
                    new KeyboardButton("🔍 Поиск манги"),
                    new KeyboardButton("🔥 Топ популярного")
                },
                new[]
                {
                    new KeyboardButton("🎲 Случайная манга"),
                    new KeyboardButton("🌐 Ссылка на сайт")
                }
            })
            {
                ResizeKeyboard = true,
                IsPersistent = true
            };
        }

        private async Task SendPopularMangaAsync(ITelegramBotClient botClient, long chatId, string frontendUrl, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MangaDbContext>();
                try
                {
                    var mangas = await context.Mangas.OrderByDescending(m => m.Rating).Take(5).ToListAsync(cancellationToken);

                    if (!mangas.Any())
                    {
                        await botClient.SendTextMessageAsync(chatId, "📭 В каталоге базы данных пока нет манги.", replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
                        return;
                    }

                    await botClient.SendTextMessageAsync(chatId, "🔥 **Популярная манга в нашем каталоге:**", parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);

                    foreach (var manga in mangas)
                    {
                        var text = $"📚 *{manga.Title}*\n" +
                                   $"👤 Автор: {manga.Author}\n" +
                                   $"⭐️ Рейтинг: {manga.Rating.ToString("F1")}/5.0\n" +
                                   $"📖 Глав: {manga.Chapters}\n" +
                                   $"🏷 Жанры: {string.Join(", ", manga.Genres)}";

                        var inlineKeyboard = new InlineKeyboardMarkup(
                            InlineKeyboardButton.WithUrl("📖 Читать на сайте", frontendUrl)
                        );

                        await botClient.SendTextMessageAsync(chatId, text, parseMode: ParseMode.Markdown, replyMarkup: inlineKeyboard, cancellationToken: cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Database error during /manga execution: {ex.Message}");
                    await botClient.SendTextMessageAsync(chatId, "❌ Произошла ошибка при обращении к базе данных.", cancellationToken: cancellationToken);
                }
            }
        }

        private async Task SearchMangaAsync(ITelegramBotClient botClient, long chatId, string query, string frontendUrl, CancellationToken cancellationToken)
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
                        await botClient.SendTextMessageAsync(chatId, $"🔍 По запросу \"{query}\" ничего не найдено.", replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
                        return;
                    }

                    await botClient.SendTextMessageAsync(chatId, $"🔎 **Результаты поиска по запросу \"{query}\":**", parseMode: ParseMode.Markdown, cancellationToken: cancellationToken);

                    foreach (var manga in mangas)
                    {
                        var text = $"📚 *{manga.Title}*\n" +
                                   $"👤 Автор: {manga.Author}\n" +
                                   $"⭐️ Рейтинг: {manga.Rating.ToString("F1")}/5.0\n" +
                                   $"🏷 Жанры: {string.Join(", ", manga.Genres)}";

                        var inlineKeyboard = new InlineKeyboardMarkup(
                            InlineKeyboardButton.WithUrl("📖 Читать на сайте", frontendUrl)
                        );

                        await botClient.SendTextMessageAsync(chatId, text, parseMode: ParseMode.Markdown, replyMarkup: inlineKeyboard, cancellationToken: cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Database error during search execution: {ex.Message}");
                    await botClient.SendTextMessageAsync(chatId, "❌ Произошла ошибка при поиске по базе данных.", cancellationToken: cancellationToken);
                }
            }
        }

        private async Task SendRandomMangaAsync(ITelegramBotClient botClient, long chatId, string frontendUrl, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<MangaDbContext>();
                try
                {
                    // OrderBy(Guid.NewGuid()) is a simple way to get a random record in EF Core
                    var manga = await context.Mangas.OrderBy(m => Guid.NewGuid()).FirstOrDefaultAsync(cancellationToken);

                    if (manga == null)
                    {
                        await botClient.SendTextMessageAsync(chatId, "📭 В каталоге базы данных пока нет манги.", replyMarkup: GetMainMenuKeyboard(), cancellationToken: cancellationToken);
                        return;
                    }

                    var text = $"🎲 **Случайная манга:**\n\n" +
                               $"📚 *{manga.Title}*\n" +
                               $"👤 Автор: {manga.Author}\n" +
                               $"⭐️ Рейтинг: {manga.Rating.ToString("F1")}/5.0\n" +
                               $"📖 Глав: {manga.Chapters}\n" +
                               $"🏷 Жанры: {string.Join(", ", manga.Genres)}";

                    var inlineKeyboard = new InlineKeyboardMarkup(
                        InlineKeyboardButton.WithUrl("📖 Читать на сайте", frontendUrl)
                    );

                    await botClient.SendTextMessageAsync(chatId, text, parseMode: ParseMode.Markdown, replyMarkup: inlineKeyboard, cancellationToken: cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Database error during /random execution: {ex.Message}");
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
