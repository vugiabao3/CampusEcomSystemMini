namespace CampusEcomSystemMini.Domain.Entities;

// Cảnh cáo vi phạm của người dùng do Admin phát hành (MODULE_6).
// Mỗi cảnh cáo ghi lại ai, lý do và lúc nào phát hành.
public class Warning
{
    public Guid Id { get; set; }

    // Người dùng bị cảnh cáo.
    public Guid UserId { get; set; }

    // Admin phát hành cảnh cáo.
    public Guid IssuedBy { get; set; }

    // Lý do cảnh cáo, ví dụ Spam, nội dung không phù hợp.
    public string Reason { get; set; } = string.Empty;

    public DateTime IssuedAt { get; set; }
}
