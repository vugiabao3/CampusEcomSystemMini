namespace CampusEcomSystemMini.Application.Admin.Users;

// Chi tiết một User cho Admin.
// Không trả PasswordHash.
public record GetAdminUserDetailResponse(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string? AvatarUrl,
    string Role,
    string Status,
    int ReputationPoints,
    DateTime CreatedAt
);