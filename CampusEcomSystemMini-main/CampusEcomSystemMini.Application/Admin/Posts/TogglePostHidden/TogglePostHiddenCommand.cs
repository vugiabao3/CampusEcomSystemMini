using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

// PUT /api/admin/posts/{id}/toggle-hidden
// Chỉ Admin: đảo ngược IsHidden của bài đăng.
// Khi ẩn (IsHidden = true) có thể cung cấp lý do.
public record TogglePostHiddenCommand(
    Guid Id,

    string? Reason
) : IRequest<TogglePostHiddenResult>;

public record TogglePostHiddenResult(
    TogglePostHiddenOutcome Outcome,
    TogglePostHiddenResponse? Response);

public enum TogglePostHiddenOutcome
{
    PostNotFound,
    Updated
}

public record TogglePostHiddenResponse(
    Guid Id,
    bool IsHidden,
    string? HiddenReason);
