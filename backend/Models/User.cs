using System;

namespace MangaWeb.Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PasswordHash { get; set; } // Nullable for social-only logins
        public long? TelegramId { get; set; } // Nullable for non-telegram registrations
        public string? GoogleId { get; set; } // Nullable for non-google logins
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
