using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

// GET /api/admin/reports?status=Pending | Approved | Rejected
// Chỉ Admin.
public record GetAdminReportsQuery(
    string? Status
) : IRequest<List<GetAdminReportsResponse>>;