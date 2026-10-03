using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Dashboard;

public class GetAdminDashboardHandler
    : IRequestHandler<
        GetAdminDashboardQuery,
        GetAdminDashboardResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPostRepository _postRepository;
    private readonly IReportRepository _reportRepository;

    public GetAdminDashboardHandler(
        IUserRepository userRepository,
        IPostRepository postRepository,
        IReportRepository reportRepository)
    {
        _userRepository = userRepository;
        _postRepository = postRepository;
        _reportRepository = reportRepository;
    }

    public async Task<GetAdminDashboardResponse> Handle(
        GetAdminDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var users =
            await _userRepository.GetAllAsync(cancellationToken);

        var posts =
            await _postRepository.GetAllAsync(
                null,
                null,
                null,
                cancellationToken);

        var reports =
            await _reportRepository.GetAllAsync(cancellationToken);

        var activeUsers = users.Count(
            x => string.Equals(
                x.Status,
                UserStatus.Active,
                StringComparison.OrdinalIgnoreCase));

        var pendingReports = reports.Count(
            x => string.Equals(
                x.Status,
                ReportStatus.Pending,
                StringComparison.OrdinalIgnoreCase));

        // Đã xử lý = Approved hoặc Rejected.
        var resolvedReports = reports.Count(
            x => ReportStatus.IsResolved(x.Status));

        var totalPoints = users.Sum(x => x.ReputationPoints);

        return new GetAdminDashboardResponse(
            users.Count,
            activeUsers,
            posts.Count,
            pendingReports,
            resolvedReports,
            totalPoints);
    }
}