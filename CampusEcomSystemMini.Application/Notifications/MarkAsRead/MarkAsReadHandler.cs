using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.MarkAsRead;

public class MarkAsReadHandler
    : IRequestHandler<MarkAsReadCommand, MarkAsReadResult>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ICurrentUserService _currentUserService;

    public MarkAsReadHandler(
        INotificationRepository notificationRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<MarkAsReadResult> Handle(
        MarkAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var notification =
            await _notificationRepository.GetByIdAsync(
                request.NotificationId,
                cancellationToken);

        if (notification is null)
        {
            return new MarkAsReadResult(
                MarkAsReadOutcome.NotFound,
                null);
        }

        // Chỉ chủ thông báo được đánh dấu đã đọc.
        if (notification.UserId != currentUserId)
        {
            return new MarkAsReadResult(
                MarkAsReadOutcome.NotOwner,
                null);
        }

        // PUT idempotent: đã đọc rồi thì trả về ngay.
        if (notification.IsRead)
        {
            return new MarkAsReadResult(
                MarkAsReadOutcome.Success,
                new MarkAsReadResponse(
                    notification.Id,
                    true));
        }

        notification.IsRead = true;

        _notificationRepository.UpdateAsync(
            notification,
            cancellationToken);

        await _notificationRepository.SaveChangesAsync(
            cancellationToken);

        return new MarkAsReadResult(
            MarkAsReadOutcome.Success,
            new MarkAsReadResponse(
                notification.Id,
                true));
    }
}
