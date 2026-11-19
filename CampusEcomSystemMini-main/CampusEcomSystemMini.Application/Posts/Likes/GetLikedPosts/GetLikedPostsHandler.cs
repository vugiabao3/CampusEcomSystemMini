using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.GetLikedPosts;

public class GetLikedPostsHandler
    : IRequestHandler<GetLikedPostsQuery, List<GetLikedPostsResponse>>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetLikedPostsHandler(
        IPostLikeRepository postLikeRepository,
        IPostRepository postRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _postLikeRepository = postLikeRepository;
        _postRepository = postRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetLikedPostsResponse>> Handle(
        GetLikedPostsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var postLikes = await _postLikeRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        if (postLikes.Count == 0)
        {
            return [];
        }

        var postIds = postLikes
            .Select(x => x.PostId)
            .Distinct()
            .ToList();

        var posts = await _postRepository.GetByIdsAsync(
            postIds,
            cancellationToken);

        var postById = posts.ToDictionary(x => x.Id);

        var authorIds = posts
            .Select(x => x.UserId)
            .Distinct()
            .ToList();

        var authors = await _userRepository.GetByIdsAsync(
            authorIds,
            cancellationToken);

        var authorById = authors.ToDictionary(x => x.Id);

        var result = new List<GetLikedPostsResponse>();

        foreach (var like in postLikes)
        {
            if (!postById.TryGetValue(like.PostId, out var post))
            {
                continue;
            }

            authorById.TryGetValue(post.UserId, out var author);

            result.Add(new GetLikedPostsResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt,
                author?.FullName,
                author?.AvatarUrl,
                like.CreatedAt));
        }

        return result
            .OrderByDescending(x => x.LikedAt)
            .ToList();
    }
}