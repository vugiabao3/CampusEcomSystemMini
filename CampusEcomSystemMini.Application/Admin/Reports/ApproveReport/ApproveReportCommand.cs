using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

// PUT /api/admin/reports/{id}/approve
// Chỉ Admin: Pending → Approved.
public record ApproveReportCommand(
    Guid Id
) : IRequest<ApproveReportResult>;