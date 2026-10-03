namespace CampusEcomSystemMini.Application.Admin.Users;

// Một dòng trong danh sách User của Admin.
// Không trả PasswordHash.
public record GetAdminUsersResponse(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string Status,
    DateTime CreatedAt,
    int ReputationPoints
);