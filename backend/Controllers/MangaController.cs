using Microsoft.AspNetCore.Mvc;
using MangaWeb.Backend.Models;
using System.Collections.Concurrent;

namespace MangaWeb.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MangaController : ControllerBase
    {
        // Mock Manga Database
        private static readonly List<Manga> Mangas = new()
        {
            new Manga
            {
                Id = 1,
                Title = "One Piece",
                Author = "Eiichiro Oda",
                Description = "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates. With a course charted for the treacherous waters of the Grand Line and beyond, this is one captain who'll never give up until he's claimed the greatest treasure on Earth—the Legendary One Piece!",
                Cover = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60",
                Genres = new() { "Action", "Adventure", "Fantasy" },
                Rating = 4.9,
                Status = "Ongoing",
                Chapters = 1110
            },
            new Manga
            {
                Id = 2,
                Title = "Naruto",
                Author = "Masashi Kishimoto",
                Description = "Twelve years ago, a fearsome Nine-Tailed Fox terrorized the Hidden Leaf Village. Today, Naruto Uzumaki, a mischievous orphan, struggles to become the village's Hokage while uncovering the dark secrets of his past.",
                Cover = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60",
                Genres = new() { "Action", "Adventure", "Martial Arts" },
                Rating = 4.7,
                Status = "Completed",
                Chapters = 700
            },
            new Manga
            {
                Id = 3,
                Title = "Attack on Titan",
                Author = "Hajime Isayama",
                Description = "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind giant concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born of hunger but what seems to be out of pleasure.",
                Cover = "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=500&auto=format&fit=crop&q=60",
                Genres = new() { "Action", "Drama", "Fantasy", "Mystery" },
                Rating = 4.8,
                Status = "Completed",
                Chapters = 139
            },
            new Manga
            {
                Id = 4,
                Title = "Demon Slayer",
                Author = "Koyoharu Gotouge",
                Description = "Tanjirou Kamado's peaceful life is shattered when he finds his family slaughtered by a demon. The sole survivor, his sister Nezuko, has been turned into a demon herself. Tanjirou sets out to become a demon slayer to cure his sister and avenge his family.",
                Cover = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60",
                Genres = new() { "Action", "Fantasy", "Historical" },
                Rating = 4.8,
                Status = "Completed",
                Chapters = 205
            },
            new Manga
            {
                Id = 5,
                Title = "My Hero Academia",
                Author = "Kohei Horikoshi",
                Description = "In a world where superpowers (known as Quirks) are the norm, Izuku Midoriya is a Quirkless boy who dreams of becoming a Hero. After a fateful encounter with the legendary Hero All Might, his life changes forever.",
                Cover = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60",
                Genres = new() { "Action", "Comedy", "School Life", "Sci-Fi" },
                Rating = 4.5,
                Status = "Ongoing",
                Chapters = 425
            }
        };

        // Mock Reviews Database
        private static readonly ConcurrentBag<Review> Reviews = new()
        {
            new Review { Id = 1, MangaId = 1, User = "OtakuKing", Text = "Absolute masterpiece! The world-building is second to none.", Rating = 5 },
            new Review { Id = 2, MangaId = 1, User = "LuffyFan", Text = "Gear 5 was epic! The current arc is amazing.", Rating = 5 },
            new Review { Id = 3, MangaId = 3, User = "ErenYeager", Text = "Dark, gritty, and keeps you on the edge of your seat. Unforgettable ending.", Rating = 5 }
        };

        // 1. GET: api/manga
        [HttpGet]
        public ActionResult<IEnumerable<Manga>> GetMangas([FromQuery] string? search, [FromQuery] string? genre)
        {
            var result = Mangas.AsEnumerable();

            if (!string.IsNullOrEmpty(search))
            {
                result = result.Where(m => 
                    m.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    m.Author.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrEmpty(genre) && !genre.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                result = result.Where(m => 
                    m.Genres.Any(g => g.Equals(genre, StringComparison.OrdinalIgnoreCase)));
            }

            return Ok(result.ToList());
        }

        // 2. GET: api/manga/{id}
        [HttpGet("{id}")]
        public ActionResult<Manga> GetManga(int id)
        {
            var manga = Mangas.FirstOrDefault(m => m.Id == id);
            if (manga == null)
            {
                return NotFound(new { error = "Manga not found" });
            }
            return Ok(manga);
        }

        // 3. GET: api/manga/{id}/reviews
        [HttpGet("{id}/reviews")]
        public ActionResult<IEnumerable<Review>> GetReviews(int id)
        {
            var mangaReviews = Reviews.Where(r => r.MangaId == id).ToList();
            return Ok(mangaReviews);
        }

        // 4. POST: api/manga/{id}/reviews
        [HttpPost("{id}/reviews")]
        public ActionResult<Review> AddReview(int id, [FromBody] Review reviewInput)
        {
            if (reviewInput == null || string.IsNullOrEmpty(reviewInput.User) || string.IsNullOrEmpty(reviewInput.Text))
            {
                return BadRequest(new { error = "User name and text are required." });
            }

            var newReview = new Review
            {
                Id = Reviews.Count + 1,
                MangaId = id,
                User = reviewInput.User,
                Text = reviewInput.Text,
                Rating = reviewInput.Rating
            };

            Reviews.Add(newReview);
            return CreatedAtAction(nameof(GetReviews), new { id = id }, newReview);
        }
    }
}
