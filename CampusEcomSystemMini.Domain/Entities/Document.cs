namespace CampusEcomSystemMini.Domain.Entities;

// Tài liệu số được sinh viên đăng lên kho tài liệu của MODULE_4.
// Người đăng (UserId) luôn lấy từ ICurrentUserService,
// không nhận từ frontend.
//
// File gốc KHÔNG lưu trong database.
// FileName là tên file người dùng gửi lên (để hiển thị và đặt tên khi download),
// StoredFileName là tên file thực tế trên local storage.
// StoredFileName là đường dẫn riêng của hệ thống,
// tuyệt đối không trả về qua API.
//
// Rating / ReviewCount là điểm và số đánh giá của tài liệu.
// Batch hiện tại chỉ upload / sửa / xóa metadata,
// Rating và ReviewCount được cập nhật ở batch Reviews.
public class Document
{
    public Guid Id { get; set; }

    // Người đăng tài liệu, liên kết tới User của Module 1.
    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    // Môn học / khoa mà tài liệu thuộc về.
    public string Subject { get; set; } = string.Empty;

    public string? Description { get; set; }

    // Free hoặc Paid.
    public string PricingType { get; set; } = "Free";

    // Giá điểm khi tài liệu trả phí, bằng 0 khi Free.
    public decimal Price { get; set; }

    // Tên file người dùng gửi lên.
    public string FileName { get; set; } = string.Empty;

    // Tên file lưu trên local storage, không trả về qua API.
    public string StoredFileName { get; set; } = string.Empty;

    // Đuôi file chuẩn hóa: pdf hoặc docx.
    public string FileType { get; set; } = string.Empty;

    // Kích thước file tính bằng byte.
    public long FileSize { get; set; }

    public decimal Rating { get; set; }

    public int ReviewCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}