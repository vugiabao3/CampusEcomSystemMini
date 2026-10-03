using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

// PUT /api/admin/reports/{id}/reject
// Chỉ Admin: Pending → Rejected. Không trừ điểm.
public record RejectReportCommand(
    Guid Id
) : IRequest<RejectReportResult>;