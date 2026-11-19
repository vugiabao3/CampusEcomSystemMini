using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.AuditLogs;

public class GetAdminAuditLogsHandler
    : IRequestHandler<
        GetAdminAuditLogsQuery,
        List<GetAdminAuditLogsResponse>>
{
    private readonly IAuditLogRepository _auditLogRepository;

    public GetAdminAuditLogsHandler(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    public async Task<List<GetAdminAuditLogsResponse>> Handle(
        GetAdminAuditLogsQuery request,
        CancellationToken cancellationToken)
    {
        var logs =
            await _auditLogRepository.GetAllAsync(cancellationToken);

        return logs
            .Select(x => new GetAdminAuditLogsResponse(
                x.Id,
                x.ActorId,
                x.Action,
                x.EntityType,
                x.EntityId,
                x.OldValues,
                x.NewValues,
                x.CreatedAt))
            .ToList();
    }
}
