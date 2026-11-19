using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class DeleteAdminPostHandler
    : IRequestHandler<
        DeleteAdminPostCommand,
        DeleteAdminPostResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteAdminPostHandler(
        IPostRepository postRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteAdminPostResponse?> Handle(
        DeleteAdminPostCommand request,
        CancellationToken cancellationToken)
    {
        var post =
            await _postRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (post is null)
        {
            return null;
        }

        // Xóa mềm bài đăng: giữ dữ liệu DB, đánh dấu IsDeleted.
        // Dữ liệu liên quan (Likes, SecretQuestion, Claim, LostFoundRecord,
        // Report) được giữ nguyên theo thiết kế hiện tại.
        post.IsDeleted = true;
        post.UpdatedAt = DateTime.UtcNow;

        _postRepository.UpdateAsync(post, cancellationToken);

        await _postRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = _currentUserService.UserId,
                Action = "DeletePost",
                EntityType = "Post",
                EntityId = post.Id,
                OldValues = $"{{\"title\":\"{post.Title}\",\"isHidden\":{post.IsHidden.ToString().ToLower()},\"isDeleted\":false}}",
                NewValues = "{\"isDeleted\":true}",
                CreatedAt = DateTime.UtcNow,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new DeleteAdminPostResponse(
            post.Id,
            post.Title,
            true);
    }
}
