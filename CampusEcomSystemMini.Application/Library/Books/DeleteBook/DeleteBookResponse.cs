namespace CampusEcomSystemMini.Application.Library.Books.DeleteBook;

public record DeleteBookResponse(
    bool Success,
    string Message
);

// Kết quả xử lý xóa bài đăng đổi sách.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
public enum DeleteBookOutcome
{
    Deleted,
    NotFound,
    NotOwner
}

public record DeleteBookResult(
    DeleteBookOutcome Outcome,
    DeleteBookResponse? Response);
