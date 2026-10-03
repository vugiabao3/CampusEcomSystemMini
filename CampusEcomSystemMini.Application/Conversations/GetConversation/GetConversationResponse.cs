namespace CampusEcomSystemMini.Application.Conversations.GetConversation;

// Một participant của cuộc trò chuyện.
public record ConversationParticipantResponse(
    Guid UserId,
    string FullName,
    string? AvatarUrl
);

// Chi tiết cuộc trò chuyện 1-1.
public record GetConversationResponse(
    Guid ConversationId,
    List<ConversationParticipantResponse> Participants
);

// Kết quả xử lý xem chi tiết cuộc trò chuyện.
// Phân biệt "không tồn tại" với "không phải participant".
public enum GetConversationOutcome
{
    Success,
    NotFound,
    NotParticipant
}

public record GetConversationResult(
    GetConversationOutcome Outcome,
    GetConversationResponse? Response);
