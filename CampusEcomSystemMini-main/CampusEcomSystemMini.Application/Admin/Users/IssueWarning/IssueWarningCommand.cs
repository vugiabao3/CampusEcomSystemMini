using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// POST /api/admin/users/{id}/warning
// Chỉ Admin: phát hành cảnh cáo cho người dùng (ghi nhận, không khóa tài khoản).
public record IssueWarningCommand(
    Guid Id,

    [Required] string Reason
) : IRequest<IssueWarningResult>;

public record IssueWarningResult(
    IssueWarningOutcome Outcome,
    IssueWarningResponse? Response);

public enum IssueWarningOutcome
{
    Issued,
    UserNotFound
}

public record IssueWarningResponse(
    Guid Id,
    Guid UserId,
    Guid IssuedBy,
    string Reason,
    DateTime IssuedAt);
