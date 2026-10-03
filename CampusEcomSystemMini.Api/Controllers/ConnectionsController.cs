using CampusEcomSystemMini.Application.Connections.AcceptRequest;
using CampusEcomSystemMini.Application.Connections.GetRequests;
using CampusEcomSystemMini.Application.Connections.RejectRequest;
using CampusEcomSystemMini.Application.Connections.SendRequest;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/connections")]
[Authorize]
public class ConnectionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConnectionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST /api/connections/requests
    // Gửi yêu cầu kết nối. Sender lấy từ JWT.
    [HttpPost("requests")]
    public async Task<ActionResult<SendRequestResponse>> SendRequest(
        SendRequestCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command,
            cancellationToken);

        switch (result.Outcome)
        {
            // Không gửi yêu cầu kết nối cho chính mình.
            case SendRequestOutcome.SelfRequest:
                return BadRequest(
                    "You cannot send a connection request to yourself.");

            // Người nhận không tồn tại.
            case SendRequestOutcome.ReceiverNotFound:
                return NotFound(
                    "Receiver does not exist.");

            // Đã có yêu cầu Pending giữa hai người dùng.
            case SendRequestOutcome.DuplicatePending:
                return Conflict(
                    "A pending connection request already exists.");

            default:
                return Created(
                    $"/api/connections/requests/{result.Response!.ConnectionRequestId}",
                    result.Response);
        }
    }

    // GET /api/connections/requests
    // Lấy yêu cầu kết nối của người dùng đang đăng nhập
    // (bao gồm Received và Sent).
    [HttpGet("requests")]
    public async Task<ActionResult<List<GetRequestsResponse>>> GetRequests(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetRequestsQuery(),
            cancellationToken);

        return Ok(result.Requests);
    }

    // PUT /api/connections/requests/{id}/accept
    // Chỉ người nhận yêu cầu mới được chấp nhận.
    [HttpPut("requests/{id:guid}/accept")]
    public async Task<ActionResult<AcceptRequestResponse>> AcceptRequest(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new AcceptRequestCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Yêu cầu kết nối không tồn tại.
            case AcceptRequestOutcome.NotFound:
                return NotFound();

            // Chỉ người nhận yêu cầu mới được chấp nhận.
            case AcceptRequestOutcome.NotReceiver:
                return Forbid();

            // Chỉ yêu cầu Pending mới được chấp nhận.
            case AcceptRequestOutcome.NotPending:
                return Conflict(
                    "Only pending connection requests can be accepted.");

            default:
                return Ok(result.Response);
        }
    }

    // PUT /api/connections/requests/{id}/reject
    // Chỉ người nhận yêu cầu mới được từ chối.
    [HttpPut("requests/{id:guid}/reject")]
    public async Task<ActionResult<RejectRequestResponse>> RejectRequest(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new RejectRequestCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Yêu cầu kết nối không tồn tại.
            case RejectRequestOutcome.NotFound:
                return NotFound();

            // Chỉ người nhận yêu cầu mới được từ chối.
            case RejectRequestOutcome.NotReceiver:
                return Forbid();

            // Chỉ yêu cầu Pending mới được từ chối.
            case RejectRequestOutcome.NotPending:
                return Conflict(
                    "Only pending connection requests can be rejected.");

            default:
                return Ok(result.Response);
        }
    }
}
