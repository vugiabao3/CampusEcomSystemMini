namespace CampusEcomSystemMini.Domain.Entities;

// Lượt thích của một người dùng cho một bài đăng.
// Người thích (UserId) luôn lấy từ ICurrentUserService,
// không nhận từ frontend.
public class PostLike
{
    public Guid Id { get; set; }

    public Guid PostId { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }
}