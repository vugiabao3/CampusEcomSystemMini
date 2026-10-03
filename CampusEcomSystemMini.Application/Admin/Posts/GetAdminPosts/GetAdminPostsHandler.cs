using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class GetAdminPostsHandler
    : IRequestHandler<
        GetAdminPostsQuery,
        List<GetAdminPostsResponse>>
{
    private const int DefaultPageSize = 20;

    private const int MaxPageSize = 200;

    // Post chưa có trường trạng thái trong model hiện tại
    // nên mọi bài đăng đều ở trạng thái Active.
    private const string ActivePostStatus = "Active";

    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;

    public GetAdminPostsHandler(
        IPostRepository postRepository,
        IUserRepository userRepository)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GetAdminPostsResponse>> Handle(
        GetAdminPostsQuery request,
        CancellationToken cancellationToken)
    {
        // type lọc ngay trong truy vấn database.
        var posts =
            await _postRepository.GetAllAsync(
                string.IsNullOrWhiteSpace(request.Type)
                    ? null
                    : request.Type.Trim(),
                null,
                null,
                cancellationToken);

        IEnumerable<Post> query = posts;

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(
                x => (x.Title ?? string.Empty)
                        .Contains(
                            search,
                            StringComparison.OrdinalIgnoreCase)
                    || (x.Content ?? string.Empty)
                        .Contains(
                            search,
                            StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = request.Status.Trim();

            query = query.Where(
                x => string.Equals(
                    GetPostStatus(x),
                    status,
                    StringComparison.OrdinalIgnoreCase));
        }

        var page = request.Page.HasValue && request.Page.Value > 0
            ? request.Page.Value
            : 1;

        var pageSize =
            request.PageSize.HasValue && request.PageSize.Value > 0
                ? Math.Min(request.PageSize.Value, MaxPageSize)
                : DefaultPageSize;

        var ordered = query
            .OrderByDescending(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .ToList();

        var pageItems = ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        if (pageItems.Count == 0)
        {
            return [];
        }

        var users =
            await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetAdminPostsResponse>(
            pageItems.Count);

        foreach (var post in pageItems)
        {
            userById.TryGetValue(post.UserId, out var author);

            result.Add(new GetAdminPostsResponse(
                post.Id,
                post.UserId,
                author?.FullName ?? string.Empty,
                post.Type,
                post.Title,
                GetPostStatus(post),
                post.CreatedAt));
        }

        return result;
    }

    // Post dùng lại model của Module 1, chưa có trường Status.
    private static string GetPostStatus(Post post)
    {
        return ActivePostStatus;
    }
}