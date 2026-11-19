using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface INotificationRepository
{
    // Thông báo của người dùng, mới nhất trước.
    Task<List<Notification>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<Notification?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Số thông báo chưa đọc của người dùng.
    Task<int> GetUnreadCountAsync(
        Guid userId,
        CancellationToken cancellationToken);

    // Kiểm tra thông báo trùng (user + type + relatedId)
    // để không tạo notification trùng lặp.
    Task<bool> ExistsByUserAndRelatedIdAsync(
        Guid userId,
        string type,
        Guid relatedId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Notification notification,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Notification notification,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
