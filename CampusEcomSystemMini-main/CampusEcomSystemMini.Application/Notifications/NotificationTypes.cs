namespace CampusEcomSystemMini.Application.Notifications;

// Các loại notification theo MODULE_5.
public static class NotificationTypes
{
    public const string ConnectionRequest = "ConnectionRequest";

    public const string ConnectionAccepted = "ConnectionAccepted";

    public const string ConnectionRejected = "ConnectionRejected";

    public const string StudyMatch = "StudyMatch";

    public const string RoomMatch = "RoomMatch";

    public const string LostFoundMatch = "LostFoundMatch";

    public const string BookExchangeMatch = "BookExchangeMatch";

    // Thông báo yêu cầu nhận đồ thất lạc (MODULE 3).
    public const string Claim = "Claim";

    // Thông báo cho admin khi có báo cáo bài đăng mới (MODULE_6).
    public const string ReportReceived = "ReportReceived";
}
