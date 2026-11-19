namespace CampusEcomSystemMini.Domain.Entities;

// Người tham gia một cuộc trò chuyện (MODULE_5 / BATCH 2).
// Mỗi cuộc trò chuyện 1-1 có đúng hai participant.
public class ConversationParticipant
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }
}
