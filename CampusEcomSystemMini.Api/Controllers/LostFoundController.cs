using CampusEcomSystemMini.Application.LostFound.GetLostFound;
using CampusEcomSystemMini.Application.LostFound.GetMap;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/lost-found")]
[Authorize]
public class LostFoundController : ControllerBase
{
    private readonly IMediator _mediator;

    public LostFoundController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/lost-found?type=Lost
    // GET /api/lost-found?type=Found
    // GET /api/lost-found?status=Returned
    [HttpGet]
    public async Task<ActionResult<List<GetLostFoundResponse>>> GetLostFound(
        [FromQuery] GetLostFoundQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/lost-found/map
    [HttpGet("map")]
    public async Task<ActionResult<List<GetLostFoundMapResponse>>> GetLostFoundMap(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetLostFoundMapQuery(),
            cancellationToken);

        return Ok(result);
    }
}