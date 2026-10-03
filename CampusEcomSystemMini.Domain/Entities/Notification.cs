namespace CampusEcomSystemMini.Domain.Entities;

// Thông báo của một người dùng (MODULE_5 / BATCH 4).
// Type ví dụ: ConnectionRequest, ConnectionAccepted,
// ConnectionRejected, StudyMatch, RoomMatch,
// LostFoundMatch, BookExchangeMatch.
public class Notification
{
    public Guid Id { get; set; }

    // Người nhận thông báo.
    public Guid UserId { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    // Id liên quan (ConnectionRequestId, UserId matched,...).
    public Guid? RelatedId { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }
}
