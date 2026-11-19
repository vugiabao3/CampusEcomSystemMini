using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.MarkMessagesAsRead;

// PUT /api/conversations/{id}/read
// Đánh dấu tất cả tin nhắn chưa đọc trong cuộc trò chuyện là đã đọc.
// Chỉ participant của cuộc trò chuyện được đánh dấu.
public record MarkMessagesAsReadCommand(
    Guid ConversationId
) : IRequest<MarkMessagesAsReadResult>;
