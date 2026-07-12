using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaWeb.Backend.Data;
using MangaWeb.Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MangaWeb.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MangaController : ControllerBase
    {
        private readonly MangaDbContext _context;

        public MangaController(MangaDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/manga
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Manga>>> GetMangas([FromQuery] string? search, [FromQuery] string? genre)
        {
            IQueryable<Manga> query = _context.Mangas;

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => 
                    m.Title.Contains(search) || 
                    m.Author.Contains(search));
            }

            if (!string.IsNullOrEmpty(genre) && !genre.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                // EF Core 8+ supports primitive collections translation in LINQ
                query = query.Where(m => m.Genres.Contains(genre));
            }

            var results = await query.ToListAsync();
            return Ok(results);
        }

        // 2. GET: api/manga/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Manga>> GetManga(int id)
        {
            var manga = await _context.Mangas.FindAsync(id);
            if (manga == null)
            {
                return NotFound(new { error = "Manga not found" });
            }
            return Ok(manga);
        }

        // 3. GET: api/manga/{id}/reviews
        [HttpGet("{id}/reviews")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int id)
        {
            var reviews = await _context.Reviews
                .Where(r => r.MangaId == id)
                .ToListAsync();
            return Ok(reviews);
        }

        // 4. POST: api/manga/{id}/reviews
        [HttpPost("{id}/reviews")]
        public async Task<ActionResult<Review>> AddReview(int id, [FromBody] Review reviewInput)
        {
            if (reviewInput == null || string.IsNullOrEmpty(reviewInput.User) || string.IsNullOrEmpty(reviewInput.Text))
            {
                return BadRequest(new { error = "User name and text are required." });
            }

            var mangaExists = await _context.Mangas.AnyAsync(m => m.Id == id);
            if (!mangaExists)
            {
                return NotFound(new { error = "Manga not found" });
            }

            var newReview = new Review
            {
                MangaId = id,
                User = reviewInput.User,
                Text = reviewInput.Text,
                Rating = reviewInput.Rating
            };

            _context.Reviews.Add(newReview);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReviews), new { id = id }, newReview);
        }

        // 5. POST: api/manga
        [HttpPost]
        public async Task<ActionResult<Manga>> AddManga([FromBody] Manga mangaInput)
        {
            if (mangaInput == null || string.IsNullOrEmpty(mangaInput.Title))
            {
                return BadRequest(new { error = "Manga title is required." });
            }

            // Ensure ID is 0 so EF Core generates a new one
            mangaInput.Id = 0;

            _context.Mangas.Add(mangaInput);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetManga), new { id = mangaInput.Id }, mangaInput);
        }
    }
}
