using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IMessageRepository
{
    // Lịch sử tin nhắn của cuộc trò chuyện,
    // theo thứ tự thời gian tăng dần, có phân trang.
    Task<List<Message>> GetByConversationIdAsync(
        Guid conversationId,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    // Tin nhắn mới nhất trong cuộc trò chuyện.
    Task<Message?> GetLastMessageAsync(
        Guid conversationId,
        CancellationToken cancellationToken);

    // Số tin nhắn gửi đến người dùng mà chưa đọc.
    Task<int> GetUnreadCountAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Message message,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Message message,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
