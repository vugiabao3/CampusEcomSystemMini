using CampusEcomSystemMini.Application.Leaderboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

// MODULE_6 — Leaderboard (Batch 2).
// Bảng xếp hạng theo điểm uy tín, hỗ trợ period = month | year.
[ApiController]
[Route("api/leaderboard")]
[Authorize]
public class LeaderboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaderboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/leaderboard?period=month
    // GET /api/leaderboard?period=year
    [HttpGet]
    public async Task<ActionResult<List<GetLeaderboardResponse>>> GetLeaderboard(
        [FromQuery] string? period,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetLeaderboardQuery(period),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/leaderboard/me
    // GET /api/leaderboard/me?period=year
    [HttpGet("me")]
    public async Task<ActionResult<GetMyRankResponse>> GetMyRank(
        [FromQuery] string? period,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyRankQuery(period),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
