using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.MarkAllAsRead;

// PUT /api/notifications/read-all
// Đánh dấu tất cả thông báo của người dùng
// đang đăng nhập thành đã đọc.
public record MarkAllAsReadCommand : IRequest<MarkAllAsReadResult>;
