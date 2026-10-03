namespace CampusEcomSystemMini.Application.Library.Documents.GetDocumentById;

// Chi tiết tài liệu kèm metadata file.
// Không trả file gốc: download đi qua
// GET /api/library/documents/{id}/download ở batch Download.
// Không trả StoredFileName vì đó là đường dẫn riêng của hệ thống.
public record GetDocumentByIdResponse(
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