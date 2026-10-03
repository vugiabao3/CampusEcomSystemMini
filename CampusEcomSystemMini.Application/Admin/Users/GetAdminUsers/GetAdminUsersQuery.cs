using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// GET /api/admin/users?page=&pageSize=&search=&status=
// Chỉ Admin.
public record GetAdminUsersQuery(
    int? Page,
    int? PageSize,
    string? Search,
    string? Status
) : IRequest<List<GetAdminUsersResponse>>;