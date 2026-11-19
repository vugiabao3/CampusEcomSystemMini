using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Reports;

public class CreateReportHandler
    : IRequestHandler<CreateReportCommand, CreateReportResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly IReportRepository _reportRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notificationService;
    private readonly ICurrentUserService _currentUserService;

    public CreateReportHandler(
        IPostRepository postRepository,
        IReportRepository reportRepository,
        IUserRepository userRepository,
        INotificationService notificationService,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
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

        // Thông báo cho tất cả admin về báo cáo mới.
        var admins = await _userRepository.GetAllAsync(
            cancellationToken);

        var reporter = await _userRepository.GetByIdAsync(
            reporterId,
            cancellationToken);

        foreach (var admin in admins.Where(a => a.Role == "Admin"))
        {
            await _notificationService.CreateNotificationAsync(
                admin.Id,
                NotificationTypes.ReportReceived,
                "Báo cáo bài đăng mới",
                $"{reporter?.FullName ?? "Người dùng"} đã báo cáo bài đăng \"{post.Title}\".",
                post.Id,
                cancellationToken);
        }

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