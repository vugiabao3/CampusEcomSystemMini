using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetPosts;

public class GetPostsHandler
    : IRequestHandler<GetPostsQuery, List<GetPostsResponse>>
{
    private readonly IPostRepository _postRepository;

    public GetPostsHandler(
        IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<List<GetPostsResponse>> Handle(
        GetPostsQuery request,
        CancellationToken cancellationToken)
    {
        var type = string.IsNullOrWhiteSpace(request.Type)
            ? null
            : request.Type.Trim();

        DateTime? createdFromUtc = null;

        DateTime? createdToUtc = null;

        // CreatedAt lưu theo UTC, "Today" tính theo giờ máy chủ.
        if (request.Time == PostTimeFilter.Today)
        {
            var startOfToday = DateTime.Now.Date;

            createdFromUtc = startOfToday.ToUniversalTime();

            createdToUtc = startOfToday
                .AddDays(1)
                .ToUniversalTime();
        }

        var posts =
            await _postRepository.GetAllAsync(
                type,
                createdFromUtc,
                createdToUtc,
                cancellationToken);

        return posts
            .Select(post => new GetPostsResponse(
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