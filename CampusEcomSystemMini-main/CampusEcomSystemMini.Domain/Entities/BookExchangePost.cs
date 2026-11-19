namespace CampusEcomSystemMini.Domain.Entities;

// Bài đăng đổi sách giáo trình trên sàn đổi sách của MODULE_4.
// Chủ bài đăng (UserId) luôn lấy từ ICurrentUserService,
// không nhận từ frontend.
//
// Book Name: sách giáo trình người đăng đang có và muốn đổi.
// Wanted Book Name: sách giáo trình người đăng đang tìm.
// Đây là hai đầu của cạnh trong đồ thị đổi sách:
// A cần X + B có X => direct match,
// A cần X + B có X + B cần Y + C có Y ... => chuỗi đổi sách.
public class BookExchangePost
{
    public Guid Id { get; set; }

    // Chủ bài đăng, liên kết tới User của Module 1.
    public Guid UserId { get; set; }

    // Tên sách đang có, sẵn sàng đổi.
    public string BookName { get; set; } = string.Empty;

    // Tên sách đang tìm để đổi.
    public string WantedBookName { get; set; } = string.Empty;

    // Tình trạng sách: New, Like New, Good, Fair ...
    public string Condition { get; set; } = string.Empty;

    // Mô tả thêm cho bài đăng.
    public string? Description { get; set; }

    // Trạng thái bài đăng, khởi tạo là Open.
    public string Status { get; set; } = "Open";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
