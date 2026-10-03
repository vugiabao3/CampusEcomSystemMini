namespace CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;

public enum DownloadDocumentOutcome
{
    Success = 0,

    // Tài liệu không tồn tại.
    NotFound = 1,

    // File gốc không còn trên storage.
    FileMissing = 2,

    // Tài liệu trả phí nhưng người tải không đủ điểm.
    InsufficientPoints = 3,

    // Hệ thống điểm chưa sẵn sàng nên không thể mua tài liệu trả phí.
    PointsUnavailable = 4,

    // Watermark thất bại, không được trả file gốc.
    WatermarkFailed = 5,

    // Lỗi khi thực hiện giao dịch điểm, không được trả file.
    PointTransactionFailed = 6,
}
