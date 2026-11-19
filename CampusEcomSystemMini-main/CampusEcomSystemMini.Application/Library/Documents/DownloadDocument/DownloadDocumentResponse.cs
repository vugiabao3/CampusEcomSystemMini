namespace CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;

// Kết quả tải tài liệu.
//
// Endpoint download trả về file nhị phân nên Response
// mang theo nội dung file đã watermark, tên file hiển thị
// và content type để Controller trả đúng header.
//
// RemainingBalance là số dư còn lại sau khi mua tài liệu trả phí,
// dùng để báo lại cho frontend. Tài liệu miễn phí thì null.
public sealed record DownloadDocumentResponse(
    byte[] Content,
    string FileName,
    string ContentType,
    int? RemainingBalance,
    bool Charged);
