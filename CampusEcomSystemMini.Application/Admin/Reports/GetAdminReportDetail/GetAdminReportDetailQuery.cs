using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

// GET /api/admin/reports/{id}
// Chỉ Admin.
public record GetAdminReportDetailQuery(
    Guid Id
) : IRequest<GetAdminReportDetailResponse?>;