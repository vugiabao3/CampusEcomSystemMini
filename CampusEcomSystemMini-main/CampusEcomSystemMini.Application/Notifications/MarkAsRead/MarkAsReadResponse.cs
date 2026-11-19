namespace CampusEcomSystemMini.Application.Notifications.MarkAsRead;

// Phản hồi đánh dấu đã đọc thông báo.
public record MarkAsReadResponse(
    Guid NotificationId,
    bool IsRead
);

// Kết quả xử lý đánh dấu đã đọc.
// Phân biệt "không tồn tại" với "không phải owner".
public enum MarkAsReadOutcome
{
    Success,
    NotFound,
    NotOwner
}

public record MarkAsReadResult(
    MarkAsReadOutcome Outcome,
    MarkAsReadResponse? Response);
