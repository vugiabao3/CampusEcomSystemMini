using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.GetUnread;

// GET /api/notifications/unread
// Unread count của người dùng đang đăng nhập.
public record GetUnreadQuery : IRequest<GetUnreadResult>;
