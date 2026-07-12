using System;
using System.Collections.Concurrent;

namespace MangaWeb.Backend.Services
{
    public class TelegramAuthStore
    {
        // code -> (telegramId, telegramUsername, telegramFirstName, confirmedAt)
        private readonly ConcurrentDictionary<string, TelegramAuthEntry> _pendingCodes = new();

        public string GenerateCode()
        {
            var code = Guid.NewGuid().ToString("N").Substring(0, 12);
            _pendingCodes[code] = new TelegramAuthEntry { CreatedAt = DateTime.UtcNow };
            return code;
        }

        public bool ConfirmCode(string code, long telegramId, string username, string firstName)
        {
            if (_pendingCodes.TryGetValue(code, out var entry))
            {
                if (entry.Confirmed) return false; // already confirmed
                if (DateTime.UtcNow - entry.CreatedAt > TimeSpan.FromMinutes(5)) return false; // expired

                entry.TelegramId = telegramId;
                entry.TelegramUsername = username;
                entry.TelegramFirstName = firstName;
                entry.Confirmed = true;
                entry.ConfirmedAt = DateTime.UtcNow;
                return true;
            }
            return false;
        }

        public TelegramAuthEntry? GetEntry(string code)
        {
            _pendingCodes.TryGetValue(code, out var entry);
            return entry;
        }

        public void RemoveCode(string code)
        {
            _pendingCodes.TryRemove(code, out _);
        }

        // Cleanup expired codes (called periodically)
        public void CleanupExpired()
        {
            var cutoff = DateTime.UtcNow.AddMinutes(-10);
            foreach (var kvp in _pendingCodes)
            {
                if (kvp.Value.CreatedAt < cutoff)
                {
                    _pendingCodes.TryRemove(kvp.Key, out _);
                }
            }
        }
    }

    public class TelegramAuthEntry
    {
        public DateTime CreatedAt { get; set; }
        public bool Confirmed { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public long TelegramId { get; set; }
        public string TelegramUsername { get; set; } = string.Empty;
        public string TelegramFirstName { get; set; } = string.Empty;
    }
}
