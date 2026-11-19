namespace CampusEcomSystemMini.Application.Notifications.GetNotifications;

// Một thông báo của người dùng đang đăng nhập.
public record GetNotificationsResponse(
    Guid NotificationId,
    string Type,
    string Title,
    string Message,
    Guid? RelatedId,
    bool IsRead,
    DateTime CreatedAt
);

public record GetNotificationsResult(
    List<GetNotificationsResponse> Notifications);
