
using CampusEcomSystemMini.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace CampusEcomSystemMini.Application.Posts.DeletePost;

public class DeletePostHandler
    : IRequestHandler<DeletePostCommand, DeletePostResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDistributedCache _cache;

    private const string CacheVersionKey = "Posts:List:Version";

    public DeletePostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<DeletePostResponse?> Handle(
        DeletePostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var post = await _postRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (post is null || post.UserId != userId)
        {
            return null;
        }

        _postRepository.Remove(post);

        await _postRepository.SaveChangesAsync(cancellationToken);

        // Đổi version sau khi xóa database thành công.
        await _cache.SetStringAsync(
            CacheVersionKey,
            Guid.NewGuid().ToString("N"),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            },
            cancellationToken);

        return new DeletePostResponse(
            true,
            "Post deleted successfully.");
    }
}
