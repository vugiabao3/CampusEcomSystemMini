namespace CampusEcomSystemMini.Application.Notifications.GetUnread;

// Số thông báo chưa đọc.
public record GetUnreadResponse(
    int UnreadCount
);

public record GetUnreadResult(
    GetUnreadResponse Response);
