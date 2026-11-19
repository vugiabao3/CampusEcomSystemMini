namespace CampusEcomSystemMini.Application.Library.Documents;

// Yêu cầu đóng dấu watermark cho file sẽ trả về người dùng.
//
// Watermark là business rule của MODULE_4:
// file tải xuống phải mang dấu của người tải
// (FullName, Email, Timestamp theo workflow).
//
// File được đưa vào dưới dạng byte[] để Application
// không phụ thuộc ASP.NET Core / IFormFile,
// giống DocumentUpload của batch Upload.
public sealed record DocumentWatermarkRequest(
    byte[] Content,
    string FileType,
    string FullName,
    string Email,
    DateTimeOffset DownloadedAt);
