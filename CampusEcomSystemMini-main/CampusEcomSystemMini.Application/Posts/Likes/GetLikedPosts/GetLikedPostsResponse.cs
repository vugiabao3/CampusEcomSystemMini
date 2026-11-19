namespace CampusEcomSystemMini.Application.Posts.Likes.GetLikedPosts;

// Chỉ trả về dữ liệu bài đăng cần thiết cho hiển thị lịch sử đã thích.
public record GetLikedPostsResponse(
    Guid PostId,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? AuthorName,
    string? AuthorAvatarUrl,
    DateTime LikedAt
);