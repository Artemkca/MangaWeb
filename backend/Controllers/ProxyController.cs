using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using MangaWeb.Backend.Services;
using System.Net.Http;

namespace MangaWeb.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProxyController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly SmartSearchService _smartSearch;

        public ProxyController(IHttpClientFactory httpClientFactory, SmartSearchService smartSearch)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            _smartSearch = smartSearch;
        }

        [HttpGet("smart-search")]
        public async Task<IActionResult> SmartSearch([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return BadRequest();
            var result = await _smartSearch.SearchAsync(query);
            return Ok(result);
        }

        [HttpGet("shikimori/search")]
        public async Task<IActionResult> SearchShikimori([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query)) return BadRequest();
            var encodedQuery = HttpUtility.UrlEncode(query);
            var url = $"https://shikimori.one/api/mangas?search={encodedQuery}&limit=1";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }

        [HttpGet("shikimori/mangas/{id}")]
        public async Task<IActionResult> GetShikimoriManga(int id)
        {
            var url = $"https://shikimori.one/api/mangas/{id}";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }
}
