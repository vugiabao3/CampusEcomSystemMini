using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.GetConversations;

// GET /api/conversations
// Lấy danh sách cuộc trò chuyện của người dùng đang đăng nhập.
public record GetConversationsQuery : IRequest<GetConversationsResult>;
