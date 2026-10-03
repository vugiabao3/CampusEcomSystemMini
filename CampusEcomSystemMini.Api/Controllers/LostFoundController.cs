using CampusEcomSystemMini.Application.LostFound.Claims.CreateClaim;
using CampusEcomSystemMini.Application.LostFound.Claims.GetClaims;
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

    // POST /api/lost-found/{postId}/claims
    [HttpPost("{postId:guid}/claims")]
    public async Task<ActionResult<CreateClaimResponse>> CreateClaim(
        Guid postId,
        CreateClaimCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { PostId = postId },
            cancellationToken);

        switch (result.Outcome)
        {
            // Bài đăng không tồn tại.
            case CreateClaimOutcome.PostNotFound:
                return NotFound();

            // Chỉ bài đăng Found mới nhận được yêu cầu nhận đồ.
            case CreateClaimOutcome.NotFoundPostType:
                return Conflict(
                    "Claims are only available for Found posts.");

            // Người nhặt đồ không tự gửi yêu cầu nhận lại đồ.
            case CreateClaimOutcome.IsFinder:
                return Forbid();

            // Chưa có câu hỏi bí mật nên chưa thể xác minh.
            case CreateClaimOutcome.NoSecretQuestion:
                return Conflict(
                    "The finder has not created a secret question yet.");

            // Câu trả lời không khớp với câu hỏi bí mật.
            case CreateClaimOutcome.InvalidAnswer:
                return BadRequest(
                    "The answer does not match the secret question.");

            default:
                return Created(
                    $"/api/lost-found/{postId}/claims/{result.Response!.ClaimId}",
                    result.Response);
        }
    }

    // GET /api/lost-found/{postId}/claims
    [HttpGet("{postId:guid}/claims")]
    public async Task<ActionResult<List<GetClaimsResponse>>> GetClaims(
        Guid postId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetClaimsQuery(postId),
            cancellationToken);

        switch (result.Outcome)
        {
            case GetClaimsOutcome.PostNotFound:
                return NotFound();

            case GetClaimsOutcome.NotFoundPostType:
                return Conflict(
                    "Claims are only available for Found posts.");

            // Chỉ chủ bài đăng Found được xem yêu cầu nhận đồ.
            case GetClaimsOutcome.NotOwner:
                return Forbid();

            default:
                return Ok(result.Claims);
        }
    }
}