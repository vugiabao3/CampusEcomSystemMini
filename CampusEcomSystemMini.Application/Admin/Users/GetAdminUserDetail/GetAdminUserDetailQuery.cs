using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// GET /api/admin/users/{id}
// Chỉ Admin. Không trả PasswordHash hoặc JWT.
public record GetAdminUserDetailQuery(
    Guid Id
) : IRequest<GetAdminUserDetailResponse?>;