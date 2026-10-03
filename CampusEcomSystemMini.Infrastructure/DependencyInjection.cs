using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Infrastructure.Data;
using CampusEcomSystemMini.Infrastructure.Repositories;
using CampusEcomSystemMini.Infrastructure.Security;
using CampusEcomSystemMini.Infrastructure.Services;
using CampusEcomSystemMini.Infrastructure.Services.Document;
using CampusEcomSystemMini.Infrastructure.Services.Document.Points;
using CampusEcomSystemMini.Infrastructure.Services.Notification;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CampusEcomSystemMini.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // =========================================================
        // DATABASE
        // =========================================================

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString(
                    "DefaultConnection"));
        });

        // =========================================================
        // USER
        // =========================================================

        services.AddScoped<
            IUserRepository,
            UserRepository>();

        // =========================================================
        // PREFERENCE / MATCHING
        // =========================================================

        services.AddScoped<
            IPreferenceRepository,
            PreferenceRepository>();

        // =========================================================
        // POSTS
        // =========================================================

        services.AddScoped<
            IPostRepository,
            PostRepository>();

        services.AddScoped<
            IPostLikeRepository,
            PostLikeRepository>();

        // =========================================================
        // LOST & FOUND
        // =========================================================

        services.AddScoped<
            ILostFoundRepository,
            LostFoundRepository>();

        services.AddScoped<
            ISecretQuestionRepository,
            SecretQuestionRepository>();

        services.AddScoped<
            IClaimRepository,
            ClaimRepository>();

        // =========================================================
        // MODULE 4 - BOOK EXCHANGE
        // =========================================================

        services.AddScoped<
            IBookExchangeRepository,
            BookExchangeRepository>();

        // =========================================================
        // MODULE 4 - DOCUMENT
        // =========================================================

        services.AddScoped<
            IDocumentRepository,
            DocumentRepository>();

        services.AddScoped<
            IDocumentStorage,
            LocalDocumentStorage>();

        services.AddScoped<
            IDocumentFileValidator,
            DocumentFileValidator>();

        services.AddScoped<
            IDocumentWatermarkService,
            DocumentWatermarkService>();

        // =========================================================
        // MODULE 4 - DOCUMENT REVIEW
        // =========================================================

        services.AddScoped<
            IDocumentReviewRepository,
            DocumentReviewRepository>();

        // =========================================================
        // MODULE 6 - POINT SERVICE
        // =========================================================
        //
        // Module 4 chỉ cần abstraction IPointService.
        // Implementation thật của hệ thống điểm sẽ thuộc Module 6.
        // Hiện tại dùng implementation tạm thời.
        //

        services.AddScoped<
            IPointService,
            UnavailablePointService>();

        // =========================================================
        // MODULE 5 - CONNECTION REQUEST
        // =========================================================

        services.AddScoped<
            IConnectionRequestRepository,
            ConnectionRequestRepository>();

        // =========================================================
        // MODULE 5 - CONVERSATION
        // =========================================================

        services.AddScoped<
            IConversationRepository,
            ConversationRepository>();

        services.AddScoped<
            IConversationParticipantRepository,
            ConversationParticipantRepository>();

        // =========================================================
        // MODULE 5 - MESSAGE
        // =========================================================

        services.AddScoped<
            IMessageRepository,
            MessageRepository>();

        // =========================================================
        // MODULE 5 - NOTIFICATION
        // =========================================================

        services.AddScoped<
            INotificationRepository,
            NotificationRepository>();

        services.AddScoped<
            INotificationService,
            NotificationService>();

        // =========================================================
        // SECURITY
        // =========================================================

        services.AddScoped<
            IPasswordHasher,
            PasswordHasher>();

        services.AddScoped<
            IJwtTokenService,
            JwtTokenService>();

        // =========================================================
        // CURRENT USER
        // =========================================================

        services.AddHttpContextAccessor();

        services.AddScoped<
            ICurrentUserService,
            CurrentUserService>();

        // =========================================================
        // MODULE 2 - SMART MATCHING
        // =========================================================

        services.AddScoped<
            IMatchingService,
            MatchingService>();

        return services;
    }
}