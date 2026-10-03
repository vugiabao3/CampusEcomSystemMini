using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Infrastructure.Data;
using CampusEcomSystemMini.Infrastructure.Repositories;
using CampusEcomSystemMini.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CampusEcomSystemMini.Infrastructure.Services;
using CampusEcomSystemMini.Infrastructure.Services.Document;
using CampusEcomSystemMini.Infrastructure.Services.Document.Points;
 
namespace CampusEcomSystemMini.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString(
                    "DefaultConnection"));
        });

        services.AddScoped<
            IUserRepository,
            UserRepository>();

        services.AddScoped<
            IPreferenceRepository,
            PreferenceRepository>();

        services.AddScoped<
            IPostRepository,
            PostRepository>();

        services.AddScoped<
            IPostLikeRepository,
            PostLikeRepository>();

        services.AddScoped<
            ILostFoundRepository,
            LostFoundRepository>();

        services.AddScoped<
            ISecretQuestionRepository,
            SecretQuestionRepository>();

        services.AddScoped<
            IClaimRepository,
            ClaimRepository>();

        // Book Exchange (Module 4 / BATCH 1)
        services.AddScoped<
            IBookExchangeRepository,
            BookExchangeRepository>();

        // Documents (Module 4 / BATCH 2)
        services.AddScoped<
            IDocumentRepository,
            DocumentRepository>();

        services.AddScoped<
            IDocumentStorage,
            LocalDocumentStorage>();

        services.AddScoped<
            IDocumentFileValidator,
            DocumentFileValidator>();

        // Download + Watermark (Module 4 / BATCH 3)
        services.AddScoped<
            IDocumentWatermarkService,
            DocumentWatermarkService>();

        // Hệ thống điểm thuộc Module 6,
        // Module 4 chỉ dùng abstraction này cho tài liệu trả phí.
        services.AddScoped<
            IPointService,
            UnavailablePointService>();

        services.AddScoped<
            IPasswordHasher,
            PasswordHasher>();

            services.AddScoped<
    IJwtTokenService,
    JwtTokenService>();

      // Current user
        services.AddHttpContextAccessor();

        services.AddScoped<
            ICurrentUserService,
            CurrentUserService>();

        // Smart Matching (Module 2)
        services.AddScoped<
            IMatchingService,
            MatchingService>();

        return services;
    }
}