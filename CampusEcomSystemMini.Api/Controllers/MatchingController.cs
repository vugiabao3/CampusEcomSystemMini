using CampusEcomSystemMini.Application.Matching.Students.GetStudentMatch;
using CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/matching")]
[Authorize]
public class MatchingController : ControllerBase
{
    private readonly IMediator _mediator;

    public MatchingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/matching/students
    [HttpGet("students")]
    public async Task<ActionResult<List<GetStudentMatchesResponse>>> GetStudentMatches(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetStudentMatchesQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/matching/students/{userId}
    [HttpGet("students/{userId:guid}")]
    public async Task<ActionResult<GetStudentMatchResponse>> GetStudentMatch(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetStudentMatchQuery(userId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}