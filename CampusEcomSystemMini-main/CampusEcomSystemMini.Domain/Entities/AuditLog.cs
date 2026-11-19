namespace CampusEcomSystemMini.Domain.Entities;

// Nhật ký kiểm tra hành động của Admin (MODULE_6 / BATCH 4).
// Ghi lại mỗi thao tác quản trị: ai, làm gì, đối tượng gì, lúc nào.
public class AuditLog
{
    public Guid Id { get; set; }

    // ID admin thực hiện hành động (lấy từ JWT).
    public Guid ActorId { get; set; }

    // Loại hành động: "BlockUser", "UnblockUser", "ApproveReport",
    // "RejectReport", "HidePost", "RestorePost", "DeletePost".
    public string Action { get; set; } = string.Empty;

    // Loại đối tượng bị tác động: "User", "Report", "Post".
    public string EntityType { get; set; } = string.Empty;

    // ID của đối tượng bị tác động.
    public Guid EntityId { get; set; }

    // Giá trị trước khi thay đổi (JSON, có thể để trống).
    public string? OldValues { get; set; }

    // Giá trị sau khi thay đổi (JSON, có thể để trống).
    public string? NewValues { get; set; }

    public DateTime CreatedAt { get; set; }
}
