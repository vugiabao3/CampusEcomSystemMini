using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetMyPosts;

public class GetMyPostsHandler
    : IRequestHandler<GetMyPostsQuery, List<GetMyPostsResponse>>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyPostsHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetMyPostsResponse>> Handle(
        GetMyPostsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var posts =
            await _postRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        return posts
            .Select(post => new GetMyPostsResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt))
            .ToList();
    }
}