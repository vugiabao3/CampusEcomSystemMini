using CampusEcomSystemMini.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Data;

public class AppDbContext : DbContext
{
    
    public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
    {
        
    }

    public DbSet<User> Users {get;set;}

    public DbSet<Preference> Preferences {get;set;}

    public DbSet<Post> Posts {get;set;}

    public DbSet<PostLike> PostLikes {get;set;}

    public DbSet<LostFoundRecord> LostFoundRecords {get;set;}

    public DbSet<SecretQuestion> SecretQuestions {get;set;}

    public DbSet<Claim> Claims {get;set;}

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Preference>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.MonthlyRentalBudget)
                .HasPrecision(18, 2);

            // Mỗi người dùng chỉ có một bộ vector nhu cầu.
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.UserId);

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PostLike>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Một người chỉ thích một bài đăng đúng một lần.
            entity.HasIndex(x => new { x.PostId, x.UserId })
                .IsUnique();

entity.HasOne<Post>()
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // SQL Server không cho phép nhiều đường cascade
            // (Users -> Posts -> PostLikes và Users -> PostLikes),
            // nên lượt thích không cascade trực tiếp từ User.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<LostFoundRecord>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Mỗi bài đăng Lost / Found chỉ có một bản ghi Lost & Found.
            entity.HasIndex(x => x.PostId).IsUnique();

            entity.HasOne<Post>()
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SecretQuestion>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Mỗi bài đăng Found chỉ có một câu hỏi bí mật.
            entity.HasIndex(x => x.PostId).IsUnique();

            entity.HasOne<Post>()
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Claim>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.PostId);

            entity.HasOne<Post>()
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // SQL Server không cho phép nhiều đường cascade
            // (Users -> Posts -> Claims và Users -> Claims),
            // nên yêu cầu nhận đồ không cascade trực tiếp từ User.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.ClaimantUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}