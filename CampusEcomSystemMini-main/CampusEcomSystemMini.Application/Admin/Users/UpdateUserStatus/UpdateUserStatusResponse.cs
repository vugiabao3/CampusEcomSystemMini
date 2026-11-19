namespace CampusEcomSystemMini.Application.Admin.Users;

// Kết quả đổi trạng thái tài khoản.
// Role không thay đổi qua use case này.
public enum UpdateUserStatusOutcome
{
    Updated,
    UserNotFound,
    InvalidStatus
}

public record UpdateUserStatusResponse(
    Guid Id,
    string FullName,
    string Role,
    string Status
);

public record UpdateUserStatusResult(
    UpdateUserStatusOutcome Outcome,
    UpdateUserStatusResponse? Response);