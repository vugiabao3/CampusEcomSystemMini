using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Infrastructure.Data;
using CampusEcomSystemMini.Infrastructure.Repositories;
using CampusEcomSystemMini.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CampusEcomSystemMini.Infrastructure.Services;
 
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