namespace CampusEcomSystemMini.Domain.Entities;

// Bài đăng của sinh viên trên campus.
// Chủ sở hữu (UserId) luôn lấy từ ICurrentUserService, không nhận từ frontend.
public class Post
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    // Nhóm nội dung: Room, Group, Lost-Found, library ...
    public string? Type { get; set; }

    // Liên kết với BookExchangePost.Id khi bài đăng này được tạo
    // từ Sàn đổi sách (type = "library"). Dùng để điều hướng từ
    // chi tiết sách giáo trình sang bài đăng cộng đồng tương ứng.
    public Guid? LibraryPostId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Bài đăng bị ẩn khi báo cáo bị duyệt (MODULE_6).
    public bool IsHidden { get; set; }

    // Lý do ẩn bài đăng (admin cung cấp khi ẩn).
    public string? HiddenReason { get; set; }

    // Bài đăng đã xóa mềm (admin xóa vi phạm, dữ liệu giữ lại DB).
    public bool IsDeleted { get; set; }
}