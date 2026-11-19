namespace CampusEcomSystemMini.Application.Auth.Me;

public record MeResponse(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string? AvatarUrl,
    string Role
);