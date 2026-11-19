using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

public class ApproveReportHandler
    : IRequestHandler<ApproveReportCommand, ApproveReportResult>
{
    private readonly IReportRepository _reportRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditLogRepository _auditLogRepository;

    public ApproveReportHandler(
        IReportRepository reportRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IAuditLogRepository auditLogRepository)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _auditLogRepository = auditLogRepository;
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

        var adminId = _currentUserService.UserId;

        report.Status = ReportStatus.Approved;

        report.ReviewedAt = DateTime.UtcNow;

        report.ReviewedBy = adminId;

        _reportRepository.UpdateAsync(report, cancellationToken);

        // Ẩn bài đăng bị báo cáo duyệt.
        var post =
            await _postRepository.GetByIdAsync(
                report.PostId,
                cancellationToken);

        if (post is not null)
        {
            post.IsHidden = true;
            post.HiddenReason = string.IsNullOrWhiteSpace(report.Reason)
                ? null
                : report.Reason.Trim();
            post.UpdatedAt = DateTime.UtcNow;

            _postRepository.UpdateAsync(post, cancellationToken);
        }

        await _reportRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = adminId,
                Action = "ApproveReport",
                EntityType = "Report",
                EntityId = report.Id,
                OldValues = $"{{\"status\":\"Pending\"}}",
                NewValues = $"{{\"status\":\"Approved\",\"postId\":\"{report.PostId}\",\"isHidden\":true,\"hiddenReason\":\"{post?.HiddenReason ?? report.Reason ?? string.Empty}\"}}",
                CreatedAt = DateTime.UtcNow,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new ApproveReportResult(
            ApproveReportOutcome.Approved,
            new ApproveReportResponse(
                report.Id,
                report.Status,
                report.ReviewedAt,
                report.ReviewedBy));
    }
}
