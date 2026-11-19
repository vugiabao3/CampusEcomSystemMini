namespace CampusEcomSystemMini.Application.Users.Profile;

public record GetProfileResponse(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string? AvatarUrl,
    string Role
);
