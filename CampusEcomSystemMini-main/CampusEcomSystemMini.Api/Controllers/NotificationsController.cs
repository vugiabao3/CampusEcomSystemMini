using CampusEcomSystemMini.Application.Notifications.GetNotifications;
using CampusEcomSystemMini.Application.Notifications.GetUnread;
using CampusEcomSystemMini.Application.Notifications.MarkAllAsRead;
using CampusEcomSystemMini.Application.Notifications.MarkAsRead;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/notifications
    // Lấy thông báo của người dùng đang đăng nhập.
    [HttpGet]
    public async Task<ActionResult<List<GetNotificationsResponse>>> GetNotifications(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetNotificationsQuery(),
            cancellationToken);

        return Ok(result.Notifications);
    }

    // GET /api/notifications/unread
    // Unread count của người dùng đang đăng nhập.
    [HttpGet("unread")]
    public async Task<ActionResult<GetUnreadResponse>> GetUnread(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetUnreadQuery(),
            cancellationToken);

        return Ok(result.Response);
    }

    // PUT /api/notifications/{id}/read
    // Chỉ owner được mark read.
    [HttpPut("{id:guid}/read")]
    public async Task<ActionResult<MarkAsReadResponse>> MarkAsRead(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new MarkAsReadCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Thông báo không tồn tại.
            case MarkAsReadOutcome.NotFound:
                return NotFound();

            // Không cho người dùng khác đánh dấu
            // đã đọc thông báo của người khác.
            case MarkAsReadOutcome.NotOwner:
                return Forbid();

            default:
                return Ok(result.Response);
        }
    }

    // PUT /api/notifications/read-all
    // Đánh dấu tất cả thông báo của người dùng
    // đang đăng nhập thành đã đọc.
    [HttpPut("read-all")]
    public async Task<ActionResult<MarkAllAsReadResponse>> MarkAllAsRead(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new MarkAllAsReadCommand(),
            cancellationToken);

        return Ok(result.Response);
    }
}
