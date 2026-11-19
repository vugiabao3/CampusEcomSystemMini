namespace CampusEcomSystemMini.Application.Library.Books.UpdateBook;

public record UpdateBookResponse(
    Guid Id,
    Guid UserId,
    string BookName,
    string WantedBookName,
    string Condition,
    string? Description,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Kết quả xử lý sửa bài đăng đổi sách.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
// Phân biệt "không tồn tại" (404) với "không phải chủ" (403).
public enum UpdateBookOutcome
{
    Updated,
    NotFound,
    NotOwner
}

public record UpdateBookResult(
    UpdateBookOutcome Outcome,
    UpdateBookResponse? Response);
