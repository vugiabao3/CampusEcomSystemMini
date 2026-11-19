namespace CampusEcomSystemMini.Application.Messages.GetMessages;

// Một tin nhắn trong lịch sử cuộc trò chuyện.
public record GetMessagesResponse(
    Guid MessageId,
    Guid SenderId,
    string SenderName,
    string Content,
    DateTime SentAt
);

// Kết quả xử lý lấy lịch sử tin nhắn.
// Phân biệt "không tồn tại" với "không phải participant".
public enum GetMessagesOutcome
{
    Success,
    NotFound,
    NotParticipant
}

public record GetMessagesResult(
    GetMessagesOutcome Outcome,
    List<GetMessagesResponse> Messages);
