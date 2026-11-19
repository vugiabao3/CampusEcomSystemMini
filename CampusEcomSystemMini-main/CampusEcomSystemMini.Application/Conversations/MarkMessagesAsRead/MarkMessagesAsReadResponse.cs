namespace CampusEcomSystemMini.Application.Conversations.MarkMessagesAsRead;

// Phản hồi đánh dấu tin nhắn đã đọc.
public record MarkMessagesAsReadResponse(
    Guid ConversationId,
    int MarkedCount
);

// Kết quả xử lý đánh dấu tin nhắn đã đọc.
public enum MarkMessagesAsReadOutcome
{
    Success,
    NotFound,
    NotParticipant
}

public record MarkMessagesAsReadResult(
    MarkMessagesAsReadOutcome Outcome,
    MarkMessagesAsReadResponse? Response);
