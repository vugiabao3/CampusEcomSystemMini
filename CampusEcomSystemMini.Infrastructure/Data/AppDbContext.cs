using CampusEcomSystemMini.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Preference> Preferences { get; set; }

    public DbSet<Post> Posts { get; set; }

    public DbSet<PostLike> PostLikes { get; set; }

    public DbSet<LostFoundRecord> LostFoundRecords { get; set; }

    public DbSet<SecretQuestion> SecretQuestions { get; set; }

    public DbSet<Claim> Claims { get; set; }

    // Module 5 - Matching / Messenger / Notification
    public DbSet<ConnectionRequest> ConnectionRequests { get; set; }

    public DbSet<Conversation> Conversations { get; set; }

    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    // Library / Book Exchange
    public DbSet<BookExchangePost> BookExchangePosts { get; set; }

    public DbSet<Document> Documents { get; set; }

    public DbSet<DocumentReview> DocumentReviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Preference>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.MonthlyRentalBudget)
                .HasPrecision(18, 2);

            entity.HasIndex(x => x.UserId)
                .IsUnique();

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

            // Không cascade trực tiếp từ User để tránh multiple cascade paths.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<LostFoundRecord>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Mỗi bài đăng Lost / Found chỉ có một bản ghi.
            entity.HasIndex(x => x.PostId)
                .IsUnique();

            entity.HasOne<Post>()
                .WithMany()
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SecretQuestion>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Mỗi bài đăng Found chỉ có một câu hỏi bí mật.
            entity.HasIndex(x => x.PostId)
                .IsUnique();

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

            // Không cascade trực tiếp từ User để tránh multiple cascade paths.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.ClaimantUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // =========================================================
        // MODULE 5 - CONNECTION REQUEST
        // =========================================================

        modelBuilder.Entity<ConnectionRequest>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.SenderId);

            entity.HasIndex(x => x.ReceiverId);

            // Users -> ConnectionRequests có 2 FK:
            // SenderId và ReceiverId.
            // Không cascade để tránh multiple cascade paths.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // =========================================================
        // MODULE 5 - CONVERSATION
        // =========================================================

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(x => x.Id);
        });

        modelBuilder.Entity<ConversationParticipant>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Một user chỉ tham gia một conversation một lần.
            entity.HasIndex(x => new { x.ConversationId, x.UserId })
                .IsUnique();

            entity.HasIndex(x => x.UserId);

            entity.HasOne<Conversation>()
                .WithMany()
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Không cascade trực tiếp từ User.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // =========================================================
        // MODULE 5 - MESSAGE
        // =========================================================

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.ConversationId);

            entity.HasIndex(x => x.SenderId);

            entity.HasOne<Conversation>()
                .WithMany()
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Không cascade trực tiếp từ User.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // =========================================================
        // MODULE 5 - NOTIFICATION
        // =========================================================

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.UserId);

            // Không cascade trực tiếp từ User để tránh multiple cascade paths.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // =========================================================
        // LIBRARY - BOOK EXCHANGE
        // =========================================================

        modelBuilder.Entity<BookExchangePost>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Danh sách bài đổi sách của user.
            entity.HasIndex(x => x.UserId);

            entity.HasIndex(x => x.Status);

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =========================================================
        // LIBRARY - DOCUMENT
        // =========================================================

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(x => x.Id);

            // Danh sách tài liệu của user.
            entity.HasIndex(x => x.UserId);

            // Lọc Free / Paid.
            entity.HasIndex(x => x.PricingType);

            entity.Property(x => x.Price)
                .HasPrecision(18, 2);

            // Rating 1-5.
            entity.Property(x => x.Rating)
                .HasPrecision(3, 2);

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =========================================================
        // LIBRARY - DOCUMENT REVIEW
        // =========================================================

        modelBuilder.Entity<DocumentReview>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.DocumentId);

            // Một user chỉ review một document một lần.
            entity.HasIndex(x => new { x.DocumentId, x.UserId })
                .IsUnique();

            entity.HasOne<Document>()
                .WithMany()
                .HasForeignKey(x => x.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Không cascade trực tiếp từ User để tránh multiple cascade paths.
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}