using CampusEcomSystemMini.Application.Matching.Rooms.CreateRoomPost;
using CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatch;
using CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatches;
using CampusEcomSystemMini.Application.Matching.Students.CreateStudentPost;
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

    // POST /api/matching/students
    [HttpPost("students")]
    public async Task<ActionResult<CreateStudentPostResponse>> CreateStudentPost(
        [FromBody] CreateStudentPostCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        switch (result.Outcome)
        {
            case CreateStudentPostOutcome.InvalidCoordinates:
                return BadRequest("Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.");
            default:
                return Created($"/api/matching/students/{result.Response!.Id}", result.Response);
        }
    }

    // GET /api/matching/rooms
    [HttpGet("rooms")]
    public async Task<ActionResult<List<GetRoomMatchesResponse>>> GetRoomMatches(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetRoomMatchesQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/matching/rooms/{userId}
    [HttpGet("rooms/{userId:guid}")]
    public async Task<ActionResult<GetRoomMatchResponse>> GetRoomMatch(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetRoomMatchQuery(userId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // POST /api/matching/rooms
    [HttpPost("rooms")]
    public async Task<ActionResult<CreateRoomPostResponse>> CreateRoomPost(
        [FromBody] CreateRoomPostCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        switch (result.Outcome)
        {
            case CreateRoomPostOutcome.InvalidCoordinates:
                return BadRequest("Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.");
            default:
                return Created($"/api/matching/rooms/{result.Response!.Id}", result.Response);
        }
    }
}
