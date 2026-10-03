namespace CampusEcomSystemMini.Application.Library.Documents.CreateDocument;

public record CreateDocumentResponse(
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

// Kết quả xử lý đăng tài liệu.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
// Mọi lỗi input / file đều trả về 400.
public enum CreateDocumentOutcome
{
    Created,
    InvalidInput,
    InvalidFile
}

public record CreateDocumentResult(
    CreateDocumentOutcome Outcome,
    CreateDocumentResponse? Response,
    string? ErrorMessage);