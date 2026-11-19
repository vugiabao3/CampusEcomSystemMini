namespace CampusEcomSystemMini.Application.Library.Documents.GetMyDocuments;

// Tài liệu do người đang đăng nhập đăng tải.
// Không trả StoredFileName vì đó là đường dẫn riêng của hệ thống.
public record GetMyDocumentsResponse(
    Guid Id,
    Guid UserId,
    string FullName,
    string Title,
    string Subject,
    string? Description,
    string PricingType,
    decimal Price,
    string FileName,
    string FileType,
    long FileSize,
    decimal Rating,
    int ReviewCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);