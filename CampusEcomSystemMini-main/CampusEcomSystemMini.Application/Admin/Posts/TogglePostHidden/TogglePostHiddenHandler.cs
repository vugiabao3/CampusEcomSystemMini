using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class TogglePostHiddenHandler
    : IRequestHandler<
        TogglePostHiddenCommand,
        TogglePostHiddenResult>
{
    private readonly IPostRepository _postRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public TogglePostHiddenHandler(
        IPostRepository postRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<TogglePostHiddenResult> Handle(
        TogglePostHiddenCommand request,
        CancellationToken cancellationToken)
    {
        var post =
            await _postRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (post is null)
        {
            return new TogglePostHiddenResult(
                TogglePostHiddenOutcome.PostNotFound,
                null);
        }

        var oldIsHidden = post.IsHidden;
        var oldReason = post.HiddenReason;

        var actorId = _currentUserService.UserId;
        var now = DateTime.UtcNow;

        post.IsHidden = !post.IsHidden;

        if (post.IsHidden)
        {
            // Đang ẩn => lưu lý do (nếu admin cung cấp).
            post.HiddenReason = string.IsNullOrWhiteSpace(request.Reason)
                ? null
                : request.Reason.Trim();
        }
        else
        {
            // Đang khôi phục => xóa lý do.
            post.HiddenReason = null;
        }

        post.UpdatedAt = now;

        _postRepository.UpdateAsync(post, cancellationToken);

        await _postRepository.SaveChangesAsync(cancellationToken);

        var action = post.IsHidden ? "HidePost" : "RestorePost";

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = actorId,
                Action = action,
                EntityType = "Post",
                EntityId = post.Id,
                OldValues = $"{{\"isHidden\":{oldIsHidden.ToString().ToLower()},\"hiddenReason\":\"{oldReason ?? string.Empty}\"}}",
                NewValues = $"{{\"isHidden\":{post.IsHidden.ToString().ToLower()},\"hiddenReason\":\"{post.HiddenReason ?? string.Empty}\"}}",
                CreatedAt = now,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new TogglePostHiddenResult(
            TogglePostHiddenOutcome.Updated,
            new TogglePostHiddenResponse(
                post.Id,
                post.IsHidden,
                post.HiddenReason));
    }
}
