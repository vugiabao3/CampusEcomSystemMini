using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class GetAdminPostsHandler
    : IRequestHandler<
        GetAdminPostsQuery,
        PagedResponse<GetAdminPostsResponse>>
{
    private const int DefaultPageSize = 20;

    private const int MaxPageSize = 200;

    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;

    public GetAdminPostsHandler(
        IPostRepository postRepository,
        IUserRepository userRepository)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
    }

    public async Task<PagedResponse<GetAdminPostsResponse>> Handle(
        GetAdminPostsQuery request,
        CancellationToken cancellationToken)
    {
        // Admin xem tất cả bài đăng, bao gồm cả bài ẩn và bài đã xóa mềm.
        var posts =
            await _postRepository.GetAllAsync(
                null,
                null,
                null,
                cancellationToken,
                includeHidden: true,
                includeDeleted: true);

        IEnumerable<Post> query = posts;

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            var normalizedType = request.Type.Trim().ToLower();

            query = query.Where(
                x => x.Type != null &&
                      x.Type.ToLower() == normalizedType);
        }

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

        var totalCount = ordered.Count;

        var pageItems = ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var totalPages = totalCount == 0
            ? 1
            : (int)Math.Ceiling((double)totalCount / pageSize);

        if (pageItems.Count == 0)
        {
            return new PagedResponse<GetAdminPostsResponse>(
                [],
                totalCount,
                totalPages,
                page,
                pageSize);
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

        return new PagedResponse<GetAdminPostsResponse>(
            result,
            totalCount,
            totalPages,
            page,
            pageSize);
    }

    // Post dùng lại model của Module 1, chưa có trường Status.
    private static string GetPostStatus(Post post)
    {
        if (post.IsDeleted)
        {
            return "Deleted";
        }

        if (post.IsHidden)
        {
            return "Hidden";
        }

        return "Active";
    }
}
