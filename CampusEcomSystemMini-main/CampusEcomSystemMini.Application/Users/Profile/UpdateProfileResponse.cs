namespace CampusEcomSystemMini.Application.Users.Profile;

public record UpdateProfileResponse(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string? AvatarUrl,
    string Role
);
