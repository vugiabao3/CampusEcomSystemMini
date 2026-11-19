using MediatR;

namespace CampusEcomSystemMini.Application.Admin.AuditLogs;

// GET /api/admin/audit-logs
// Chỉ Admin.
public record GetAdminAuditLogsQuery
    : IRequest<List<GetAdminAuditLogsResponse>>;
