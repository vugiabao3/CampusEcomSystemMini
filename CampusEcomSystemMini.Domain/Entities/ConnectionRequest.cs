namespace CampusEcomSystemMini.Domain.Entities;

// Yêu cầu kết nối giữa hai sinh viên (MODULE_5 / BATCH 1).
// Người gửi lấy từ ICurrentUserService, không nhận từ client.
// Trạng thái: Pending / Accepted / Rejected.
public class ConnectionRequest
{
    public Guid Id { get; set; }

    // Người gửi yêu cầu kết nối.
    public Guid SenderId { get; set; }

    // Người nhận yêu cầu kết nối.
    public Guid ReceiverId { get; set; }

    // Pending / Accepted / Rejected.
    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
