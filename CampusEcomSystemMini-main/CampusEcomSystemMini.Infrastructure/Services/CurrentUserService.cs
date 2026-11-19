using System.Security.Claims;
using CampusEcomSystemMini.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CampusEcomSystemMini.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId
    {
        get
        {
            var userIdClaim =
                _httpContextAccessor
                    .HttpContext?
                    .User
                    .FindFirst(
                        ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                throw new UnauthorizedAccessException(
                    "User ID was not found.");
            }

            if (!Guid.TryParse(
                    userIdClaim.Value,
                    out var userId))
            {
                throw new UnauthorizedAccessException(
                    "Invalid user ID.");
            }

            return userId;
        }
    }
}