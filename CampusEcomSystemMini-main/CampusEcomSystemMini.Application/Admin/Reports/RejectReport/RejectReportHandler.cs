using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

public class RejectReportHandler
    : IRequestHandler<RejectReportCommand, RejectReportResult>
{
    private readonly IReportRepository _reportRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditLogRepository _auditLogRepository;

    public RejectReportHandler(
        IReportRepository reportRepository,
        ICurrentUserService currentUserService,
        IAuditLogRepository auditLogRepository)
    {
        _reportRepository = reportRepository;
        _currentUserService = currentUserService;
        _auditLogRepository = auditLogRepository;
    }

    public async Task<RejectReportResult> Handle(
        RejectReportCommand request,
        CancellationToken cancellationToken)
    {
        var report =
            await _reportRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (report is null)
        {
            return new RejectReportResult(
                RejectReportOutcome.ReportNotFound,
                null);
        }

        // Không xử lý lại report đã Approved / Rejected.
        if (ReportStatus.IsResolved(report.Status))
        {
            return new RejectReportResult(
                RejectReportOutcome.AlreadyResolved,
                null);
        }

        var adminId = _currentUserService.UserId;

        report.Status = ReportStatus.Rejected;

        report.ReviewedAt = DateTime.UtcNow;

        report.ReviewedBy = adminId;

        _reportRepository.UpdateAsync(report, cancellationToken);

        await _reportRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = adminId,
                Action = "RejectReport",
                EntityType = "Report",
                EntityId = report.Id,
                OldValues = $"{{\"status\":\"Pending\"}}",
                NewValues = $"{{\"status\":\"Rejected\"}}",
                CreatedAt = DateTime.UtcNow,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new RejectReportResult(
            RejectReportOutcome.Rejected,
            new RejectReportResponse(
                report.Id,
                report.Status,
                report.ReviewedAt,
                report.ReviewedBy));
    }
}
