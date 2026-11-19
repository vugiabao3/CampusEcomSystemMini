namespace CampusEcomSystemMini.Application.Library.Documents;

public enum PointServiceStatus
{
    // Giao dịch điểm đã hoàn tất, có thể trả file cho người mua.
    Completed = 0,

    // Người mua không đủ điểm để mua.
    InsufficientBalance = 1,

    // Hệ thống điểm chưa được triển khai (Module 6).
    Unavailable = 2,

    // Lỗi kỹ thuật khi giao dịch, không được trả file.
    Failed = 3,
}
