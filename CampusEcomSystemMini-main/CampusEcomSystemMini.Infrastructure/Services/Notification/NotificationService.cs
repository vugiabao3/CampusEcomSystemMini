using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Infrastructure.Services.Notification;

// Notification Service prototype (MODULE_5 / BATCH 5):
// các module nghiệp vụ gọi CreateNotificationAsync
// để tạo thông báo, không cần event infrastructure.
public class NotificationService
    : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationBroadcaster _broadcaster;

    public NotificationService(
        INotificationRepository notificationRepository,
        INotificationBroadcaster broadcaster)
    {
        _notificationRepository = notificationRepository;
        _broadcaster = broadcaster;
    }

    public async Task CreateNotificationAsync(
        Guid userId,
        string type,
        string title,
        string message,
        Guid? relatedId,
        CancellationToken cancellationToken)
    {
        // Qualify đầy đủ vì namespace
        // ...Services.Notification trùng tên entity.
        var notification =
            new CampusEcomSystemMini.Domain.Entities.Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = type,
                Title = title,
                Message = message,
                RelatedId = relatedId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

        await _notificationRepository.AddAsync(
            notification,
            cancellationToken);

        await _notificationRepository.SaveChangesAsync(
            cancellationToken);

        // Phát real-time qua SignalR đến tất cả client (prototype);
        // client l?c theo userId trong payload.
        var payload = new
        {
            id = notification.Id,
            type,
            title,
            message,
            relatedId,
            createdAt = notification.CreatedAt
        };

        await _broadcaster.BroadcastAsync(
            userId,
            payload,
            cancellationToken);
    }
}
