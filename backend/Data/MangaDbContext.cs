using Microsoft.EntityFrameworkCore;
using MangaWeb.Backend.Models;

namespace MangaWeb.Backend.Data
{
    public class MangaDbContext : DbContext
    {
        public MangaDbContext(DbContextOptions<MangaDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Manga> Mangas => Set<Manga>();
        public DbSet<Review> Reviews => Set<Review>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure mapping or rules if needed
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.TelegramId).IsUnique();
                entity.HasIndex(e => e.GoogleId).IsUnique();
            });

            modelBuilder.Entity<Manga>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
        }
    }
}
