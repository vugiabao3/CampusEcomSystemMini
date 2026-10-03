using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

public class ApproveReportHandler
    : IRequestHandler<ApproveReportCommand, ApproveReportResult>
{
    private readonly IReportRepository _reportRepository;
    private readonly ICurrentUserService _currentUserService;

    public ApproveReportHandler(
        IReportRepository reportRepository,
        ICurrentUserService currentUserService)
    {
        _reportRepository = reportRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ApproveReportResult> Handle(
        ApproveReportCommand request,
        CancellationToken cancellationToken)
    {
        var report =
            await _reportRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (report is null)
        {
            return new ApproveReportResult(
                ApproveReportOutcome.ReportNotFound,
                null);
        }

        // Không xử lý lại report đã Approved / Rejected.
        if (ReportStatus.IsResolved(report.Status))
        {
            return new ApproveReportResult(
                ApproveReportOutcome.AlreadyResolved,
                null);
        }

        // Admin đang xử lý lấy từ JWT.
        var adminId = _currentUserService.UserId;

        report.Status = ReportStatus.Approved;

        report.ReviewedAt = DateTime.UtcNow;

        report.ReviewedBy = adminId;

        _reportRepository.UpdateAsync(report, cancellationToken);

        await _reportRepository.SaveChangesAsync(cancellationToken);

        return new ApproveReportResult(
            ApproveReportOutcome.Approved,
            new ApproveReportResponse(
                report.Id,
                report.Status,
                report.ReviewedAt,
                report.ReviewedBy));
    }
}