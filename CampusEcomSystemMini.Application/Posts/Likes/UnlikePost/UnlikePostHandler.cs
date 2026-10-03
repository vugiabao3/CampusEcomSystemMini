using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.UnlikePost;

public class UnlikePostHandler
    : IRequestHandler<UnlikePostCommand, UnlikePostResponse?>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly ICurrentUserService _currentUserService;

    public UnlikePostHandler(
        IPostLikeRepository postLikeRepository,
        ICurrentUserService currentUserService)
    {
        _postLikeRepository = postLikeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UnlikePostResponse?> Handle(
        UnlikePostCommand request,
        CancellationToken cancellationToken)
    {
        // Người thích luôn là người đang đăng nhập.
        var userId = _currentUserService.UserId;

        var postLike =
            await _postLikeRepository.GetByPostAndUserAsync(
                request.Id,
                userId,
                cancellationToken);

        // Chỉ gỡ được lượt thích của chính mình.
        if (postLike is null)
        {
            return null;
        }

        _postLikeRepository.Remove(postLike);

        await _postLikeRepository.SaveChangesAsync(
            cancellationToken);

        return new UnlikePostResponse(
            true,
            "Post unliked successfully.");
    }
}