namespace CampusEcomSystemMini.Application.Library.Documents.DeleteDocument;

public record DeleteDocumentResponse(
    bool Success,
    string Message
);

// Kết quả xử lý xóa tài liệu.
// Phân biệt "không tồn tại" (404) với "không phải chủ" (403).
public enum DeleteDocumentOutcome
{
    Deleted,
    NotFound,
    NotOwner
}

public record DeleteDocumentResult(
    DeleteDocumentOutcome Outcome,
    DeleteDocumentResponse? Response);