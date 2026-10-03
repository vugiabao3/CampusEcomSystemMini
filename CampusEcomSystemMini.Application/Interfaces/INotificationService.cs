namespace CampusEcomSystemMini.Application.Interfaces;

// Notification Service đơn giản (prototype) theo
// MODULE_5: các module nghiệp vụ gọi để tạo thông báo,
// không cần event infrastructure (Kafka/RabbitMQ).
public interface INotificationService
{
    Task CreateNotificationAsync(
        Guid userId,
        string type,
        string title,
        string message,
        Guid? relatedId,
        CancellationToken cancellationToken);
}
