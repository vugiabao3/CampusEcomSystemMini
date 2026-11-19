using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// PUT /api/admin/users/{id}/reactivate
// Chỉ Admin: khôi phục tài khoản (Active, xóa thông tin khóa tạm).
public record ReactivateUserCommand(
    Guid Id
) : IRequest<ReactivateUserResult>;

public record ReactivateUserResult(
    ReactivateUserOutcome Outcome,
    ReactivateUserResponse? Response);

public enum ReactivateUserOutcome
{
    Reactivated,
    UserNotFound,
    NotLocked
}

public record ReactivateUserResponse(
    Guid Id,
    string Status);
