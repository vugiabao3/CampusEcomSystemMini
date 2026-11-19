using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;


namespace CampusEcomSystemMini.Application.Matching.Students.CreateStudentPost;

public class CreateStudentPostHandler
    : IRequestHandler<CreateStudentPostCommand, CreateStudentPostResult>
{

    private const string CacheVersionKey = "Posts:List:Version";
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
        private readonly IDistributedCache _cache;

    public CreateStudentPostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
                _cache = cache;

    }

    public async Task<CreateStudentPostResult> Handle(
        CreateStudentPostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var type = PostInput.NormalizeType(request.Type) ?? "Group";
        var isLostFound = PostInput.IsLostFoundType(type);
        if (isLostFound && !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new CreateStudentPostResult(CreateStudentPostOutcome.InvalidCoordinates, null);
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
        await _postRepository.SaveChangesAsync(cancellationToken);




 await _cache.SetStringAsync(
            CacheVersionKey,
            Guid.NewGuid().ToString("N"),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            },
            cancellationToken);








        return new CreateStudentPostResult(
            CreateStudentPostOutcome.Created,
            new CreateStudentPostResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt));
    }
}




