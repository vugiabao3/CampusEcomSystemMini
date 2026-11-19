using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace CampusEcomSystemMini.Application.Matching.Rooms.CreateRoomPost;

public class CreateRoomPostHandler
    : IRequestHandler<CreateRoomPostCommand, CreateRoomPostResult>
{
    private const string CacheVersionKey = "Posts:List:Version";

    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDistributedCache _cache;

    public CreateRoomPostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<CreateRoomPostResult> Handle(CreateRoomPostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var type = PostInput.NormalizeType(request.Type) ?? "Room";
        var isLostFound = PostInput.IsLostFoundType(type);
        if (isLostFound && !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new CreateRoomPostResult(CreateRoomPostOutcome.InvalidCoordinates, null);
        }
        var now = DateTime.UtcNow;
        var post = new Post { Id = Guid.NewGuid(), UserId = userId, Title = request.Title.Trim(), Content = request.Content.Trim(), Type = type, CreatedAt = now, UpdatedAt = now };
        await _postRepository.AddAsync(post, cancellationToken);
        await _postRepository.SaveChangesAsync(cancellationToken);

        await _cache.SetStringAsync(
            CacheVersionKey,
            Guid.NewGuid().ToString("N"),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            },
            cancellationToken);

        return new CreateRoomPostResult(CreateRoomPostOutcome.Created, new CreateRoomPostResponse(post.Id, post.UserId, post.Title, post.Content, post.Type, post.CreatedAt, post.UpdatedAt));
    }
}
