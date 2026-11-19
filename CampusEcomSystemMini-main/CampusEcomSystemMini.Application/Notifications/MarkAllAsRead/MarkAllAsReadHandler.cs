using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.MarkAllAsRead;

public class MarkAllAsReadHandler
    : IRequestHandler<MarkAllAsReadCommand, MarkAllAsReadResult>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ICurrentUserService _currentUserService;

    public MarkAllAsReadHandler(
        INotificationRepository notificationRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<MarkAllAsReadResult> Handle(
        MarkAllAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Chỉ đánh dấu đã đọc thông báo của
        // người dùng đang đăng nhập.
        var notifications =
            await _notificationRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var unreadNotifications = notifications
            .Where(x => !x.IsRead)
            .ToList();

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;

            _notificationRepository.UpdateAsync(
                notification,
                cancellationToken);
        }

        await _notificationRepository.SaveChangesAsync(
            cancellationToken);

        return new MarkAllAsReadResult(
            new MarkAllAsReadResponse(
                unreadNotifications.Count));
    }
}
