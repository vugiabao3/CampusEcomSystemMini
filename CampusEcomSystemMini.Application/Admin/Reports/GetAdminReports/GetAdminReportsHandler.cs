using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Reports;

public class GetAdminReportsHandler
    : IRequestHandler<
        GetAdminReportsQuery,
        List<GetAdminReportsResponse>>
{
    private readonly IReportRepository _reportRepository;
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;

    public GetAdminReportsHandler(
        IReportRepository reportRepository,
        IPostRepository postRepository,
        IUserRepository userRepository)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GetAdminReportsResponse>> Handle(
        GetAdminReportsQuery request,
        CancellationToken cancellationToken)
    {
        // GetAllAsync đã sắp xếp mới nhất lên đầu.
        var reports =
            await _reportRepository.GetAllAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = request.Status.Trim();

            reports = reports
                .Where(x => string.Equals(
                    x.Status,
                    status,
                    StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        if (reports.Count == 0)
        {
            return [];
        }

        var users =
            await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var postIds = reports
            .Select(x => x.PostId)
            .Distinct()
            .ToList();

        var posts =
            await _postRepository.GetAllAsync(
                null,
                null,
                null,
                cancellationToken);

        var postById = posts
            .Where(x => postIds.Contains(x.Id))
            .ToDictionary(x => x.Id);

        var result = new List<GetAdminReportsResponse>(
            reports.Count);

        foreach (var report in reports)
        {
            userById.TryGetValue(report.ReporterId, out var reporter);

            postById.TryGetValue(report.PostId, out var post);

            result.Add(new GetAdminReportsResponse(
                report.Id,
                report.PostId,
                post?.Title ?? string.Empty,
                report.ReporterId,
                reporter?.FullName ?? string.Empty,
                report.Reason,
                report.Description,
                report.Status,
                report.CreatedAt));
        }

        return result;
    }
}