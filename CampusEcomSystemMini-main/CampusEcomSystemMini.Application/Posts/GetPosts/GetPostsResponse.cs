namespace CampusEcomSystemMini.Application.Posts.GetPosts;

// AuthorName / AuthorAvatarUrl lấy từ entity User hiện có
// để feed hiển thị đúng người đăng, không thêm bảng hay API mới.
public record GetPostsResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    Guid? LibraryPostId,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? AuthorName,
    string? AuthorAvatarUrl
);