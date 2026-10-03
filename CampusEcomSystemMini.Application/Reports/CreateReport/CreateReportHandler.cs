using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Reports;

public class CreateReportHandler
    : IRequestHandler<CreateReportCommand, CreateReportResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly IReportRepository _reportRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateReportHandler(
        IPostRepository postRepository,
        IReportRepository reportRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _reportRepository = reportRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreateReportResponse?> Handle(
        CreateReportCommand request,
        CancellationToken cancellationToken)
    {
        // Bài đăng không tồn tại thì không báo cáo được.
        var post =
            await _postRepository.GetByIdAsync(
                request.PostId,
                cancellationToken);

        if (post is null)
        {
            return null;
        }

        // Người báo cáo lấy từ JWT, không tin frontend.
        var reporterId = _currentUserService.UserId;

        var report = new Report
        {
            Id = Guid.NewGuid(),
            PostId = post.Id,
            ReporterId = reporterId,
            Reason = request.Reason.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
            Status = ReportStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _reportRepository.AddAsync(
            report,
            cancellationToken);

        await _reportRepository.SaveChangesAsync(
            cancellationToken);

        return new CreateReportResponse(
            report.Id,
            report.PostId,
            report.ReporterId,
            report.Reason,
            report.Description,
            report.Status,
            report.CreatedAt);
    }
}