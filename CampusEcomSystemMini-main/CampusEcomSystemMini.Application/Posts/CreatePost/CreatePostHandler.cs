
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;

using CampusEcomSystemMini.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace CampusEcomSystemMini.Application.Posts.CreatePost;

public class CreatePostHandler
    : IRequestHandler<CreatePostCommand, CreatePostResult>
{
    private readonly IPostRepository _postRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDistributedCache _cache;

    private const string CacheVersionKey = "Posts:List:Version";

    public CreatePostHandler(
        IPostRepository postRepository,
        ILostFoundRepository lostFoundRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _postRepository = postRepository;
        _lostFoundRepository = lostFoundRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<CreatePostResult> Handle(
        CreatePostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var type = PostInput.NormalizeType(request.Type);
         var isLostFound = PostInput.IsLostFoundType(type);

        if (isLostFound &&
            !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new CreatePostResult(
                CreatePostOutcome.InvalidCoordinates,
                null);
        }

        var now = DateTime.UtcNow;

        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            Type = type,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _postRepository.AddAsync(post, cancellationToken);

        if (isLostFound)
        {
            var record = new LostFoundRecord
            {
                Id = Guid.NewGuid(),
                PostId = post.Id,
                Status = type,
                Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim(),
                Lat = request.Lat,
                Lng = request.Lng,
                CreatedAt = now,
                UpdatedAt = now
            };

            await _lostFoundRepository.AddAsync(record, cancellationToken);
        }

        await _postRepository.SaveChangesAsync(
            cancellationToken);

        // Đổi version để GET không sử dụng các cache danh sách cũ.
        await _cache.SetStringAsync(
            CacheVersionKey,
            Guid.NewGuid().ToString("N"),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            },
            cancellationToken);

        return new CreatePostResult(
            CreatePostOutcome.Created,
            new CreatePostResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt));
    }
}
