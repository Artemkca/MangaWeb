using MangaWeb.Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace MangaWeb.Backend.Data
{
    public static class DbSeeder
    {
        public static void Seed(MangaDbContext context)
        {
            if (!context.Mangas.Any())
            {
                var initialMangas = new List<Manga>
                {
                    new Manga
                    {
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

                context.Mangas.AddRange(initialMangas);
                context.SaveChanges();
            }

            if (!context.Reviews.Any())
            {
                var initialReviews = new List<Review>
                {
                    new Review { MangaId = 1, User = "OtakuKing", Text = "Absolute masterpiece! The world-building is second to none.", Rating = 5 },
                    new Review { MangaId = 1, User = "LuffyFan", Text = "Gear 5 was epic! The current arc is amazing.", Rating = 5 },
                    new Review { MangaId = 3, User = "ErenYeager", Text = "Dark, gritty, and keeps you on the edge of your seat. Unforgettable ending.", Rating = 5 }
                };

                context.Reviews.AddRange(initialReviews);
                context.SaveChanges();
            }
        }
    }
}
