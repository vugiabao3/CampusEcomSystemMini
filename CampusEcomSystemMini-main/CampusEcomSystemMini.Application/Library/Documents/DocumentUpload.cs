namespace CampusEcomSystemMini.Application.Library.Documents;

// File người dùng đăng tải lên, đã được tách khỏi HTTP ở Controller.
// Application không phụ thuộc ASP.NET Core nên không dùng IFormFile.
// Batch Download / Watermark đọc lại file qua DocumentUpload.Content.
public record DocumentUpload(
    string FileName,
    long Length,
    Stream Content);