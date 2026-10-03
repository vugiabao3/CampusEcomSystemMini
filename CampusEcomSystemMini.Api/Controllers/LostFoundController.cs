using CampusEcomSystemMini.Application.LostFound.GetLostFound;
using CampusEcomSystemMini.Application.LostFound.GetMap;
using CampusEcomSystemMini.Application.LostFound.SecretQuestions.CreateSecretQuestion;
using CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;
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

    // POST /api/lost-found/{postId}/secret-question
    [HttpPost("{postId:guid}/secret-question")]
    public async Task<ActionResult<CreateSecretQuestionResponse>> CreateSecretQuestion(
        Guid postId,
        CreateSecretQuestionCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { PostId = postId },
            cancellationToken);

        switch (result.Outcome)
        {
            // Bài đăng không tồn tại.
            case CreateSecretQuestionOutcome.PostNotFound:
                return NotFound();

            // Chỉ bài đăng Found mới có câu hỏi bí mật.
            case CreateSecretQuestionOutcome.NotFoundPostType:
                return Conflict(
                    "Secret question is only available for Found posts.");

            // Người đang đăng nhập không phải chủ bài đăng Found.
            case CreateSecretQuestionOutcome.NotOwner:
                return Forbid();

            // Bài đăng đã có câu hỏi bí mật.
            case CreateSecretQuestionOutcome.AlreadyExists:
                return Conflict(
                    "Secret question already exists.");

            default:
                return Created(
                    $"/api/lost-found/{postId}/secret-question",
                    result.Response);
        }
    }

    // GET /api/lost-found/{postId}/secret-question
    [HttpGet("{postId:guid}/secret-question")]
    public async Task<ActionResult<GetSecretQuestionResponse>> GetSecretQuestion(
        Guid postId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetSecretQuestionQuery(postId),
            cancellationToken);

        // Bài đăng không tồn tại hoặc chưa có câu hỏi bí mật.
        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}