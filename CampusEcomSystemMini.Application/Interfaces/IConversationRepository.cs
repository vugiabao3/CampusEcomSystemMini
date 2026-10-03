using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Các cuộc trò chuyện có người dùng là participant.
    Task<List<Conversation>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    // Cuộc trò chuyện 1-1 giữa hai người dùng (nếu đã có).
    Task<Conversation?> GetBetweenUsersAsync(
        Guid firstUserId,
        Guid secondUserId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Conversation conversation,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Conversation conversation,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
