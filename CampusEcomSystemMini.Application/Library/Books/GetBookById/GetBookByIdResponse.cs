namespace CampusEcomSystemMini.Application.Library.Books.GetBookById;

// Chi tiết một bài đăng đổi sách.
// Không trả về thông tin nhạy cảm của chủ bài đăng,
// chỉ cần tên hiển thị và UserId để frontend biết chủ bài đăng.
public record GetBookByIdResponse(
    Guid Id,
    Guid UserId,
    string FullName,
    string BookName,
    string WantedBookName,
    string Condition,
    string? Description,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
