using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Reports;

public class GetMyReportsHandler
    : IRequestHandler<GetMyReportsQuery, List<GetMyReportsResponse>>
{
    private readonly IReportRepository _reportRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyReportsHandler(
        IReportRepository reportRepository,
        ICurrentUserService currentUserService)
    {
        _reportRepository = reportRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetMyReportsResponse>> Handle(
        GetMyReportsQuery request,
        CancellationToken cancellationToken)
    {
        // Người dùng lấy từ JWT, không tin frontend.
        var reporterId = _currentUserService.UserId;

        var reports =
            await _reportRepository.GetByReporterIdAsync(
                reporterId,
                cancellationToken);

        return reports
            .Select(x => new GetMyReportsResponse(
                x.Id,
                x.PostId,
                x.Reason,
                x.Description,
                x.Status,
                x.CreatedAt))
            .ToList();
    }
}