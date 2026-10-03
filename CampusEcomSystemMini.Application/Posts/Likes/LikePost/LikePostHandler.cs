using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.LikePost;

public class LikePostHandler
    : IRequestHandler<LikePostCommand, LikePostResponse?>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public LikePostHandler(
        IPostLikeRepository postLikeRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _postLikeRepository = postLikeRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<LikePostResponse?> Handle(
        LikePostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var post =
            await _postRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (post is null)
        {
            return null;
        }

        var existingLike =
            await _postLikeRepository.GetByPostAndUserAsync(
                post.Id,
                userId,
                cancellationToken);

        // Không tạo lượt thích trùng cho cùng một người dùng.
        if (existingLike is not null)
        {
            return null;
        }

        var postLike = new PostLike
        {
            Id = Guid.NewGuid(),
            PostId = post.Id,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _postLikeRepository.AddAsync(
            postLike,
            cancellationToken);

        await _postLikeRepository.SaveChangesAsync(
            cancellationToken);

        return new LikePostResponse(
            postLike.Id,
            postLike.PostId,
            postLike.UserId,
            postLike.CreatedAt);
    }
}