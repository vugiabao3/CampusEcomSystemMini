namespace CampusEcomSystemMini.Application.Library.Documents.UpdateDocument;

public record UpdateDocumentResponse(
    Guid Id,
    Guid UserId,
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

// Kết quả xử lý sửa metadata tài liệu.
// Phân biệt "không tồn tại" (404) với "không phải chủ" (403).
public enum UpdateDocumentOutcome
{
    Updated,
    NotFound,
    NotOwner,
    InvalidInput
}

public record UpdateDocumentResult(
    UpdateDocumentOutcome Outcome,
    UpdateDocumentResponse? Response,
    string? ErrorMessage);