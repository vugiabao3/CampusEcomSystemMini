using CampusEcomSystemMini.Application.Conversations.GetConversation;
using CampusEcomSystemMini.Application.Conversations.GetConversations;
using CampusEcomSystemMini.Application.Messages.GetMessages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConversationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/conversations
    // Danh sách cuộc trò chuyện của người dùng đang đăng nhập,
    // kèm người kia, tin nhắn cuối, thời gian và số chưa đọc.
    [HttpGet]
    public async Task<ActionResult<List<GetConversationsResponse>>> GetConversations(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetConversationsQuery(),
            cancellationToken);

        return Ok(result.Conversations);
    }

    // GET /api/conversations/{id}
    // Chỉ participant được xem chi tiết cuộc trò chuyện.
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetConversationResponse>> GetConversation(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetConversationQuery(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Cuộc trò chuyện không tồn tại.
            case GetConversationOutcome.NotFound:
                return NotFound();

            // Người dùng không phải participant của cuộc trò chuyện.
            case GetConversationOutcome.NotParticipant:
                return Forbid();

            default:
                return Ok(result.Response);
        }
    }

    // GET /api/conversations/{conversationId}/messages?page=1&pageSize=30
    // Lịch sử tin nhắn. Chỉ participant được xem.
    [HttpGet("{conversationId:guid}/messages")]
    public async Task<ActionResult<List<GetMessagesResponse>>> GetMessages(
        Guid conversationId,
        [FromQuery] GetMessagesQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query with { ConversationId = conversationId },
            cancellationToken);

        switch (result.Outcome)
        {
            // Cuộc trò chuyện không tồn tại.
            case GetMessagesOutcome.NotFound:
                return NotFound();

            // Người dùng không phải participant của cuộc trò chuyện.
            case GetMessagesOutcome.NotParticipant:
                return Forbid();

            default:
                return Ok(result.Messages);
        }
    }
}
