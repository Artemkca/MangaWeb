namespace MangaWeb.Backend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int MangaId { get; set; }
        public string User { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
