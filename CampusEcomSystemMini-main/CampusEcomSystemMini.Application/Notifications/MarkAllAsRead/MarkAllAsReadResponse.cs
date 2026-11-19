namespace CampusEcomSystemMini.Application.Notifications.MarkAllAsRead;

// Phản hồi đánh dấu đã đọc tất cả thông báo.
public record MarkAllAsReadResponse(
    int MarkedCount
);

public record MarkAllAsReadResult(
    MarkAllAsReadResponse Response);
