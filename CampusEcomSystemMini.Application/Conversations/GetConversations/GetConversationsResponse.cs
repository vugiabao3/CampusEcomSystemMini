namespace CampusEcomSystemMini.Application.Conversations.GetConversations;

// Một mục trong danh sách cuộc trò chuyện của người dùng.
// OtherUser là người kia trong cuộc trò chuyện 1-1.
public record GetConversationsResponse(
    Guid ConversationId,
    Guid OtherUserId,
    string OtherUserName,
    string? OtherUserAvatarUrl,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount
);

public record GetConversationsResult(
    List<GetConversationsResponse> Conversations);
