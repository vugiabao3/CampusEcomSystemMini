namespace CampusEcomSystemMini.Application.Library.Books.GetBooks;

// Chỉ trả về dữ liệu bài đăng đổi sách mà UI cần.
// Không trả về entity hay thông tin nhạy cảm.
public record GetBooksResponse(
    Guid Id,
    Guid UserId,
    string FullName,
    string BookName,
    string WantedBookName,
    string Condition,
    string? Description,
    string Status,
    DateTime CreatedAt
);
