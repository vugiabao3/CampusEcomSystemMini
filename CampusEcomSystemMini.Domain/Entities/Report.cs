namespace CampusEcomSystemMini.Domain.Entities;

using CampusEcomSystemMini.Domain.Enums;

// Báo cáo của người dùng về một bài đăng vi phạm (MODULE_6).
// Reporter lấy từ ICurrentUserService, không nhận từ frontend.
public class Report
{
    public Guid Id { get; set; }

    // Bài đăng bị báo cáo.
    public Guid PostId { get; set; }

    // Người gửi báo cáo.
    public Guid ReporterId { get; set; }

    // Lý do báo cáo, ví dụ Spam.
    public string Reason { get; set; } = string.Empty;

    // Mô tả chi tiết, có thể để trống.
    public string? Description { get; set; }

    // Pending / Approved / Rejected.
    public string Status { get; set; } = ReportStatus.Pending;

    public DateTime CreatedAt { get; set; }

    // Admin xử lý lúc nào.
    public DateTime? ReviewedAt { get; set; }

    // Admin nào đã xử lý.
    public Guid? ReviewedBy { get; set; }
}