using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IConversationParticipantRepository
{
    Task<List<ConversationParticipant>> GetByConversationIdAsync(
        Guid conversationId,
        CancellationToken cancellationToken);

    // Kiểm tra người dùng có phải participant của cuộc trò chuyện.
    Task<ConversationParticipant?> GetByConversationAndUserAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken cancellationToken);

    Task AddAsync(
        ConversationParticipant participant,
        CancellationToken cancellationToken);

    void UpdateAsync(
        ConversationParticipant participant,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
