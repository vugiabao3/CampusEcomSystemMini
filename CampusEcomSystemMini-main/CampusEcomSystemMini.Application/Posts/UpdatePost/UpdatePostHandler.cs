
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace CampusEcomSystemMini.Application.Posts.UpdatePost;

public class UpdatePostHandler
    : IRequestHandler<UpdatePostCommand, UpdatePostResult>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDistributedCache _cache;

    private const string CacheVersionKey = "Posts:List:Version";

    public UpdatePostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<UpdatePostResult> Handle(
        UpdatePostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var post = await _postRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (post is null || post.UserId != userId)
        {
            return new UpdatePostResult(
                UpdatePostOutcome.Updated,
                null);
        }

        var type = PostInput.NormalizeType(request.Type);
        var isLostFound = PostInput.IsLostFoundType(type);

        if (isLostFound &&
            !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new UpdatePostResult(
                UpdatePostOutcome.InvalidCoordinates,
                null);
        }

        post.Title = request.Title.Trim();
        post.Content = request.Content.Trim();
        post.Type = type;
        post.UpdatedAt = DateTime.UtcNow;

         _postRepository.UpdateAsync(
            post,
            cancellationToken);

        await _postRepository.SaveChangesAsync(cancellationToken);

        // Đổi version sau khi cập nhật database thành công.
        await _cache.SetStringAsync(
            CacheVersionKey,
            Guid.NewGuid().ToString("N"),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            },
            cancellationToken);

        return new UpdatePostResult(
            UpdatePostOutcome.Updated,
            new UpdatePostResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt));
    }
}
