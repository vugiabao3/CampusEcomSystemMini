using CampusEcomSystemMini.Application.Reports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

// MODULE_6 — Report (Batch 3).
// Người dùng báo cáo bài đăng và xem báo cáo của mình.
[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST /api/reports
    // Reporter lấy từ JWT, không nhận ReporterId từ frontend.
    [HttpPost]
    public async Task<ActionResult<CreateReportResponse>> CreateReport(
        CreateReportCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command,
            cancellationToken);

        // Bài đăng không tồn tại.
        if (result is null)
        {
            return NotFound();
        }

        return Created(
            $"/api/reports/{result.Id}",
            result);
    }

    // GET /api/reports/me
    // Chỉ lấy báo cáo của chính người đang đăng nhập.
    [HttpGet("me")]
    public async Task<ActionResult<List<GetMyReportsResponse>>> GetMyReports(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyReportsQuery(),
            cancellationToken);

        return Ok(result);
    }
}