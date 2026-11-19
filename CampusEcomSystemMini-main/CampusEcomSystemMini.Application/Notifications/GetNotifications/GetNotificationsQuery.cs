using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.GetNotifications;

// GET /api/notifications
// Lấy thông báo của người dùng đang đăng nhập.
public record GetNotificationsQuery : IRequest<GetNotificationsResult>;
