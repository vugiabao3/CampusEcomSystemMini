using MediatR;

namespace CampusEcomSystemMini.Application.Messages.GetMessages;

// GET /api/conversations/{conversationId}/messages?page=1&pageSize=30
// Phân trang không bắt buộc, mặc định page = 1, pageSize = 30.
public record GetMessagesQuery : IRequest<GetMessagesResult>
{
    public Guid ConversationId { get; init; }

    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 30;
}
