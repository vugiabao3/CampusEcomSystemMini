using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// PUT /api/admin/users/{id}/suspend
// Chỉ Admin: khóa tạm thời (Suspended) hoặc khóa vĩnh viễn (Blocked nếu không có thời hạn).
public record SuspendUserCommand(
    Guid Id,

    [Required] string Reason,

    // Thời điểm hết hạn khóa (UTC). Nếu null => khóa vĩnh viễn.
    DateTime? SuspendUntilUtc
) : IRequest<SuspendUserResult>;

public record SuspendUserResult(
    SuspendUserOutcome Outcome,
    SuspendUserResponse? Response);

public enum SuspendUserOutcome
{
    Suspended,
    UserNotFound
}

public record SuspendUserResponse(
    Guid Id,
    string Status,
    DateTime? SuspensionExpiry,
    string SuspensionReason);
