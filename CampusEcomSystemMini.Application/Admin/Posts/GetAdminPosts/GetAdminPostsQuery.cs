using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

// GET /api/admin/posts?type=&status=&search=&page=&pageSize=
// Chỉ Admin.
public record GetAdminPostsQuery(
    string? Type,
    string? Status,
    string? Search,
    int? Page,
    int? PageSize
) : IRequest<List<GetAdminPostsResponse>>;