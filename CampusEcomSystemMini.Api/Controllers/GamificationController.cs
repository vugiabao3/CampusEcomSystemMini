using CampusEcomSystemMini.Application.Gamification;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

// MODULE_6 — Gamification (Batch 1).
// Điểm uy tín và lịch sử điểm của người dùng đang đăng nhập.
[ApiController]
[Route("api/gamification")]
[Authorize]
public class GamificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public GamificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/gamification/me
    [HttpGet("me")]
    public async Task<ActionResult<GetMyPointsResponse>> GetMyPoints(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyPointsQuery(),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // GET /api/gamification/history
    [HttpGet("history")]
    public async Task<ActionResult<List<GetPointHistoryResponse>>> GetPointHistory(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetPointHistoryQuery(),
            cancellationToken);

        return Ok(result);
    }
}
