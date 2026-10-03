using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetPosts;

// GET /api/posts?type=...&time=...
// Hai tham số đều không bắt buộc, có thể dùng đồng thời.
public record GetPostsQuery(
    string? Type,
    PostTimeFilter? Time
) : IRequest<List<GetPostsResponse>>;