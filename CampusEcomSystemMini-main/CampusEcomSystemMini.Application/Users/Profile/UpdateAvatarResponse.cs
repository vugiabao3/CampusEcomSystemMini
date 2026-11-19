namespace CampusEcomSystemMini.Application.Users.Profile;

public record UpdateAvatarResponse(
    Guid Id,
    string? AvatarUrl
);
