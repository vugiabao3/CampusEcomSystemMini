using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.GetConversation;

// GET /api/conversations/{id}
// Chỉ participant được xem chi tiết cuộc trò chuyện.
public record GetConversationQuery(
    Guid ConversationId
) : IRequest<GetConversationResult>;
