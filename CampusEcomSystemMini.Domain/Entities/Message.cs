namespace CampusEcomSystemMini.Domain.Entities;

// Tin nhắn trong một cuộc trò chuyện (MODULE_5 / BATCH 2).
// Người gửi lấy từ ICurrentUserService, không nhận từ client.
public class Message
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid SenderId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime SentAt { get; set; }

    // Tin nhắn đã được người nhận đọc hay chưa.
    public bool IsRead { get; set; }
}
