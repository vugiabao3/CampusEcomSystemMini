using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.MarkAsRead;

// PUT /api/notifications/{id}/read
// Chỉ owner được mark read.
public record MarkAsReadCommand(
    Guid NotificationId
) : IRequest<MarkAsReadResult>;
