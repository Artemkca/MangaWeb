using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Google.Apis.Auth;
using MangaWeb.Backend.Data;
using MangaWeb.Backend.Models;
using System.Security.Cryptography;
using MangaWeb.Backend.Services;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace MangaWeb.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MangaDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly TelegramAuthStore _telegramAuthStore;

        public AuthController(MangaDbContext context, IConfiguration configuration, TelegramAuthStore telegramAuthStore)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
            _telegramAuthStore = telegramAuthStore;
        }

        // DTOs for Requests
        public class RegisterRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class TelegramLoginRequest
        {
            public long Id { get; set; }
            public string First_Name { get; set; } = string.Empty;
            public string? Username { get; set; }
            public string? Photo_Url { get; set; }
            public long Auth_Date { get; set; }
            public string Hash { get; set; } = string.Empty;
        }

        public class GoogleLoginRequest
        {
            public string IdToken { get; set; } = string.Empty;
        }

        // 1. POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { error = "Username, email, and password are required." });
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { error = "User with this email already exists." });
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { error = "Username is already taken." });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        // 2. POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { error = "Email and password are required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            {
                return Unauthorized(new { error = "Invalid email or password." });
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { error = "Invalid email or password." });
            }

            return Ok(new
            {
                token = Guid.NewGuid().ToString(), // Mock session token
                username = user.Username,
                email = user.Email
            });
        }

        // 3a. POST: api/auth/telegram/init — Generate auth code for bot-based login
        [HttpPost("telegram/init")]
        public IActionResult TelegramInit()
        {
            var code = _telegramAuthStore.GenerateCode();
            return Ok(new { code });
        }

        // 3b. GET: api/auth/telegram/status/{code} — Poll for auth confirmation
        [HttpGet("telegram/status/{code}")]
        public async Task<IActionResult> TelegramStatus(string code)
        {
            var entry = _telegramAuthStore.GetEntry(code);
            if (entry == null)
                return NotFound(new { error = "Code not found or expired." });

            if (!entry.Confirmed)
                return Ok(new { confirmed = false });

            // Auth confirmed — find or create user in DB
            var user = await _context.Users.FirstOrDefaultAsync(u => u.TelegramId == entry.TelegramId);
            if (user == null)
            {
                var username = !string.IsNullOrEmpty(entry.TelegramUsername) ? entry.TelegramUsername : $"tg_{entry.TelegramId}";
                user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    user = new User
                    {
                        Username = username,
                        Email = $"{username}@telegram.mangaweb",
                        TelegramId = entry.TelegramId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    user.TelegramId = entry.TelegramId;
                }
                await _context.SaveChangesAsync();
            }

            // Clean up the used code
            _telegramAuthStore.RemoveCode(code);

            return Ok(new
            {
                confirmed = true,
                token = Guid.NewGuid().ToString(),
                username = user.Username,
                email = user.Email,
                telegramId = user.TelegramId
            });
        }

        // 3c. POST: api/auth/telegram (legacy widget-based — kept for compatibility)
        [HttpPost("telegram")]
        public async Task<IActionResult> TelegramLogin([FromBody] TelegramLoginRequest request)
        {
            var botToken = _configuration["Telegram:BotToken"];
            if (string.IsNullOrEmpty(botToken) || botToken == "YOUR_TELEGRAM_BOT_TOKEN_HERE")
            {
                return BadRequest(new { error = "Telegram Authentication is not configured on the server." });
            }

            if (!VerifyTelegramHash(request, botToken))
            {
                return Unauthorized(new { error = "Telegram authentication signature verification failed." });
            }

            var authDateTime = DateTimeOffset.FromUnixTimeSeconds(request.Auth_Date).UtcDateTime;
            if (DateTime.UtcNow - authDateTime > TimeSpan.FromDays(1))
            {
                return Unauthorized(new { error = "Telegram session has expired." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.TelegramId == request.Id);
            if (user == null)
            {
                var username = request.Username ?? $"tg_{request.Id}";
                user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    user = new User
                    {
                        Username = username,
                        Email = $"{username}@telegram.mangaweb",
                        TelegramId = request.Id,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    user.TelegramId = request.Id;
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                token = Guid.NewGuid().ToString(),
                username = user.Username,
                email = user.Email,
                telegramId = user.TelegramId
            });
        }

        // 4. POST: api/auth/google
        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var clientId = _configuration["Google:ClientId"];
            if (string.IsNullOrEmpty(clientId) || clientId == "YOUR_GOOGLE_CLIENT_ID_HERE")
            {
                return BadRequest(new { error = "Google Authentication is not configured on the server." });
            }

            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
                if (payload == null)
                {
                    return Unauthorized(new { error = "Google validation returned empty payload." });
                }

                // Find or create user by Google Subject ID or Email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject || u.Email == payload.Email);
                if (user == null)
                {
                    var username = payload.Name.Replace(" ", "") + "_" + new Random().Next(100, 999);
                    user = new User
                    {
                        Username = username,
                        Email = payload.Email,
                        GoogleId = payload.Subject,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    if (string.IsNullOrEmpty(user.GoogleId))
                    {
                        user.GoogleId = payload.Subject;
                    }
                }
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    token = Guid.NewGuid().ToString(), // Mock session token
                    username = user.Username,
                    email = user.Email,
                    googleId = user.GoogleId
                });
            }
            catch (InvalidJwtException ex)
            {
                return Unauthorized(new { error = $"Invalid Google token: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Google login failed: {ex.Message}" });
            }
        }

        // Helper to verify Telegram login signature
        private bool VerifyTelegramHash(TelegramLoginRequest request, string botToken)
        {
            // Prepare parameters list in alphabetical order (excluding hash)
            var dataList = new System.Collections.Generic.List<string>
            {
                $"auth_date={request.Auth_Date}",
                $"first_name={request.First_Name}",
                $"id={request.Id}"
            };

            if (!string.IsNullOrEmpty(request.Username))
                dataList.Add($"username={request.Username}");

            if (!string.IsNullOrEmpty(request.Photo_Url))
                dataList.Add($"photo_url={request.Photo_Url}");

            dataList.Sort();

            var dataCheckString = string.Join("\n", dataList);

            // Compute secret key: SHA256 of botToken
            byte[] secretKey;
            using (var sha256 = SHA256.Create())
            {
                secretKey = sha256.ComputeHash(Encoding.UTF8.GetBytes(botToken));
            }

            // Compute HMAC-SHA256 of dataCheckString using the secret key
            byte[] hmacBytes;
            using (var hmac = new HMACSHA256(secretKey))
            {
                hmacBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(dataCheckString));
            }

            // Convert HMAC to hex string
            var computedHash = BitConverter.ToString(hmacBytes).Replace("-", "").ToLower();

            // Compare computed hash with received hash
            return computedHash == request.Hash.ToLower();
        }
    }
}
