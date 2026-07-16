using System.Text.Json;

namespace MangaWeb.Backend.Services;

public class SmartSearchResult
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string MainCharacter { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public List<string> Genres { get; set; } = new();
    public double Rating { get; set; }
    public int Chapters { get; set; }
}

public class SmartSearchService
{
    private readonly HttpClient _http;

    public SmartSearchService(HttpClient http)
    {
        _http = http;
    }

    public async Task<SmartSearchResult> SearchAsync(string query)
    {
        var result = new SmartSearchResult { Title = query };

        // Запускаем запросы параллельно
        var shikiTask = SearchShikimori(query);
        var dexTask = SearchMangaDex(query);
        var remangaTask = SearchRemanga(query);

        await Task.WhenAll(shikiTask, dexTask, remangaTask);

        var shikiData = await shikiTask;
        var dexData = await dexTask;
        var remangaData = await remangaTask;

        // Агрегация жанров (убираем дубли)
        var allGenres = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (shikiData?.Genres != null) foreach(var g in shikiData.Genres) allGenres.Add(g);
        if (dexData?.Genres != null) foreach(var g in dexData.Genres) allGenres.Add(g);
        if (remangaData?.Genres != null) foreach(var g in remangaData.Genres) allGenres.Add(g);
        result.Genres = allGenres.ToList();

        // Выбираем самое длинное описание
        var descriptions = new[] { shikiData?.Description, dexData?.Description, remangaData?.Description }
            .Where(d => !string.IsNullOrWhiteSpace(d))
            .OrderByDescending(d => d!.Length)
            .ToList();
        
        result.Description = descriptions.FirstOrDefault() ?? string.Empty;

        // Автор и ГГ
        result.Author = remangaData?.Author ?? dexData?.Author ?? shikiData?.Author ?? string.Empty;
        result.MainCharacter = remangaData?.MainCharacter ?? shikiData?.MainCharacter ?? string.Empty;

        // Обложка, рейтинг, главы (приоритет Шикимори/Реманге для обложек, так как ссылки прямее)
        result.CoverUrl = shikiData?.CoverUrl ?? remangaData?.CoverUrl ?? string.Empty;
        result.Rating = shikiData?.Rating > 0 ? shikiData.Rating : (remangaData?.Rating ?? 0);
        result.Chapters = shikiData?.Chapters > 0 ? shikiData.Chapters : (remangaData?.Chapters ?? 0);

        if (string.IsNullOrEmpty(result.Title))
        {
            result.Title = remangaData?.Title ?? shikiData?.Title ?? dexData?.Title ?? query;
        }

        return result;
    }

    private async Task<SmartSearchResult?> SearchShikimori(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://shikimori.one/api/mangas?search={Uri.EscapeDataString(query)}&limit=1");
            req.Headers.Add("User-Agent", "MangaWeb/1.0");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (doc.RootElement.GetArrayLength() == 0) return null;

            var manga = doc.RootElement[0];
            var id = manga.GetProperty("id").GetInt32();
            
            var detailReq = new HttpRequestMessage(HttpMethod.Get, $"https://shikimori.one/api/mangas/{id}");
            detailReq.Headers.Add("User-Agent", "MangaWeb/1.0");
            var detailRes = await _http.SendAsync(detailReq);
            
            if (!detailRes.IsSuccessStatusCode) return null;
            using var detailDoc = JsonDocument.Parse(await detailRes.Content.ReadAsStringAsync());
            var root = detailDoc.RootElement;

            var result = new SmartSearchResult();
            if (root.TryGetProperty("russian", out var titleRu) && !string.IsNullOrEmpty(titleRu.GetString()))
                result.Title = titleRu.GetString()!;
            else if (root.TryGetProperty("name", out var titleEn))
                result.Title = titleEn.GetString()!;

            if (root.TryGetProperty("description", out var desc))
                result.Description = desc.GetString()?.Replace("[i]", "").Replace("[/i]", "").Replace("[b]", "").Replace("[/b]", "") ?? "";

            if (root.TryGetProperty("score", out var scoreStr))
            {
                if (double.TryParse(scoreStr.GetString(), out var score))
                    result.Rating = Math.Round(score / 2.0, 1);
            }

            if (root.TryGetProperty("chapters", out var chaps)) result.Chapters = chaps.GetInt32();
            if (result.Chapters == 0 && root.TryGetProperty("volumes", out var vols)) result.Chapters = vols.GetInt32();

            if (root.TryGetProperty("image", out var img) && img.TryGetProperty("original", out var origImg))
                result.CoverUrl = "https://shikimori.one" + origImg.GetString();

            if (root.TryGetProperty("genres", out var genres))
            {
                foreach (var g in genres.EnumerateArray())
                {
                    if (g.TryGetProperty("russian", out var gr) && !string.IsNullOrEmpty(gr.GetString()))
                        result.Genres.Add(gr.GetString()!);
                    else if (g.TryGetProperty("name", out var gn))
                        result.Genres.Add(gn.GetString()!);
                }
            }

            return result;
        }
        catch { return null; }
    }

    private async Task<SmartSearchResult?> SearchMangaDex(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.mangadex.org/manga?title={Uri.EscapeDataString(query)}&limit=1&includes[]=author");
            req.Headers.Add("User-Agent", "MangaWeb/1.0");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (!doc.RootElement.TryGetProperty("data", out var data) || data.GetArrayLength() == 0) return null;

            var manga = data[0];
            var attrs = manga.GetProperty("attributes");
            
            var result = new SmartSearchResult();

            if (attrs.TryGetProperty("description", out var descObj))
            {
                if (descObj.TryGetProperty("ru", out var ruDesc)) result.Description = ruDesc.GetString() ?? "";
                else if (descObj.TryGetProperty("en", out var enDesc)) result.Description = enDesc.GetString() ?? "";
            }

            if (attrs.TryGetProperty("tags", out var tags))
            {
                foreach (var t in tags.EnumerateArray())
                {
                    if (t.TryGetProperty("attributes", out var tAttr) && tAttr.TryGetProperty("name", out var tName))
                    {
                        if (tName.TryGetProperty("en", out var enTag))
                        {
                            var tagStr = enTag.GetString();
                            if (!string.IsNullOrEmpty(tagStr)) result.Genres.Add(tagStr);
                        }
                    }
                }
            }

            if (manga.TryGetProperty("relationships", out var rels))
            {
                foreach (var r in rels.EnumerateArray())
                {
                    if (r.TryGetProperty("type", out var type) && type.GetString() == "author")
                    {
                        if (r.TryGetProperty("attributes", out var rAttr) && rAttr.TryGetProperty("name", out var aName))
                        {
                            result.Author = aName.GetString() ?? "";
                            break;
                        }
                    }
                }
            }

            return result;
        }
        catch { return null; }
    }

    private async Task<SmartSearchResult?> SearchRemanga(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.remanga.org/api/search/catalog/?query={Uri.EscapeDataString(query)}&count=1");
            req.Headers.Add("User-Agent", "Mozilla/5.0"); // Remanga likes standard UAs
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (!doc.RootElement.TryGetProperty("content", out var content) || content.GetArrayLength() == 0) return null;

            var manga = content[0];
            var dir = manga.GetProperty("dir").GetString();
            
            var detailReq = new HttpRequestMessage(HttpMethod.Get, $"https://api.remanga.org/api/titles/{dir}/");
            detailReq.Headers.Add("User-Agent", "Mozilla/5.0");
            var detailRes = await _http.SendAsync(detailReq);
            if (!detailRes.IsSuccessStatusCode) return null;

            using var detailDoc = JsonDocument.Parse(await detailRes.Content.ReadAsStringAsync());
            if (!detailDoc.RootElement.TryGetProperty("content", out var dContent)) return null;

            var result = new SmartSearchResult();
            
            if (dContent.TryGetProperty("rus_name", out var rusName) && !string.IsNullOrEmpty(rusName.GetString()))
                result.Title = rusName.GetString()!;
            else if (dContent.TryGetProperty("en_name", out var enName))
                result.Title = enName.GetString()!;

            if (dContent.TryGetProperty("description", out var desc))
            {
                var dStr = desc.GetString() ?? "";
                dStr = System.Text.RegularExpressions.Regex.Replace(dStr, "<.*?>", ""); // Strip HTML
                result.Description = dStr;
            }

            if (dContent.TryGetProperty("genres", out var genres))
            {
                foreach(var g in genres.EnumerateArray())
                    if(g.TryGetProperty("name", out var gName) && !string.IsNullOrEmpty(gName.GetString()))
                        result.Genres.Add(gName.GetString()!);
            }

            if (dContent.TryGetProperty("categories", out var cats))
            {
                foreach(var c in cats.EnumerateArray())
                    if(c.TryGetProperty("name", out var cName) && !string.IsNullOrEmpty(cName.GetString()))
                        result.Genres.Add(cName.GetString()!);
            }

            if (dContent.TryGetProperty("publishers", out var pubs) && pubs.GetArrayLength() > 0)
            {
                if(pubs[0].TryGetProperty("name", out var pName))
                    result.Author = pName.GetString() ?? "";
            }

            if (dContent.TryGetProperty("count_chapters", out var chaps))
                result.Chapters = chaps.GetInt32();
                
            if (dContent.TryGetProperty("avg_rating", out var rating))
            {
                if (double.TryParse(rating.GetString(), out var rat))
                     result.Rating = Math.Round(rat / 2.0, 1); // 10 point to 5 point
            }
            
            if (dContent.TryGetProperty("img", out var img) && img.TryGetProperty("high", out var highImg))
            {
                result.CoverUrl = "https://remanga.org" + highImg.GetString();
            }

            return result;
        }
        catch { return null; }
    }
}
