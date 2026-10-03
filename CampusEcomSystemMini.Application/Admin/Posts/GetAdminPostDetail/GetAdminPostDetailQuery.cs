using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

// GET /api/admin/posts/{id}
// Chỉ Admin.
public record GetAdminPostDetailQuery(
    Guid Id
) : IRequest<GetAdminPostDetailResponse?>;