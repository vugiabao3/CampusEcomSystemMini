namespace CampusEcomSystemMini.Application.Library.Documents.GetDocuments;

// Chỉ trả về dữ liệu tài liệu mà UI cần.
// FileType và FileSize là metadata file, không phải file gốc.
// Rating / ReviewCount do batch Reviews cập nhật.
// Không trả về StoredFileName vì đó là đường dẫn riêng của hệ thống.
public record GetDocumentsResponse(
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