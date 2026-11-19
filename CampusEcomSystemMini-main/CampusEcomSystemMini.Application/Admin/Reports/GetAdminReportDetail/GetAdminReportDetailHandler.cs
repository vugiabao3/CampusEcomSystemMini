using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

public class GetAdminReportDetailHandler
    : IRequestHandler<
        GetAdminReportDetailQuery,
        GetAdminReportDetailResponse?>
{
    private readonly IReportRepository _reportRepository;
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;

    public GetAdminReportDetailHandler(
        IReportRepository reportRepository,
        IPostRepository postRepository,
        IUserRepository userRepository)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
        _userRepository = userRepository;
    }

    public async Task<GetAdminReportDetailResponse?> Handle(
        GetAdminReportDetailQuery request,
        CancellationToken cancellationToken)
    {
        var report =
            await _reportRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (report is null)
        {
            return null;
        }

        var post =
            await _postRepository.GetByIdAsync(
                report.PostId,
                cancellationToken);

        var users =
            await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        userById.TryGetValue(report.ReporterId, out var reporter);

        userById.TryGetValue(
            post?.UserId ?? Guid.Empty,
            out var postOwner);

        return new GetAdminReportDetailResponse(
            report.Id,
            report.PostId,
            post?.Title ?? string.Empty,
            post?.Content ?? string.Empty,
            post?.UserId ?? Guid.Empty,
            postOwner?.FullName ?? string.Empty,
            report.ReporterId,
            reporter?.FullName ?? string.Empty,
            report.Reason,
            report.Description,
            report.Status,
            report.CreatedAt,
            report.ReviewedAt,
            report.ReviewedBy);
    }
}