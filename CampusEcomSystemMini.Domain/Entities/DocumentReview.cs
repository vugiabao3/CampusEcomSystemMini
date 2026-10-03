namespace CampusEcomSystemMini.Domain.Entities;

// Đánh giá của sinh viên về một tài liệu — MODULE 4 (BATCH 4).
//
// Mỗi người dùng chỉ đánh giá một tài liệu đúng một lần,
// nên có index unique trên (DocumentId, UserId).
// Sửa / xóa review chỉ người tạo được thực hiện
// và UserId luôn lấy từ ICurrentUserService, không nhận từ frontend.
//
// Rating / ReviewCount trên Document là điểm trung bình
// và số review của tài liệu, được cập nhật mỗi khi
// thêm / sửa / xóa review.
public class DocumentReview
{
    public Guid Id { get; set; }

    // Tài liệu được đánh giá, liên kết tới Document của batch Documents.
    public Guid DocumentId { get; set; }

    // Người viết review, liên kết tới User của Module 1.
    public Guid UserId { get; set; }

    // Điểm đánh giá 1–5.
    public int Rating { get; set; }

    // Nội dung nhận xét, có thể để trống.
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}