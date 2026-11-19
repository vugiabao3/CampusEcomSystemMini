using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Dashboard;

// GET /api/admin/dashboard
// Chỉ Admin.
public record GetAdminDashboardQuery
    : IRequest<GetAdminDashboardResponse>;