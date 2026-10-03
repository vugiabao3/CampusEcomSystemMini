using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.GetNotifications;

public class GetNotificationsHandler
    : IRequestHandler<GetNotificationsQuery, GetNotificationsResult>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetNotificationsHandler(
        INotificationRepository notificationRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetNotificationsResult> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Chỉ lấy thông báo của người dùng đang đăng nhập.
        var notifications =
            await _notificationRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var result = notifications
            .Select(
                notification => new GetNotificationsResponse(
                    notification.Id,
                    notification.Type,
                    notification.Title,
                    notification.Message,
                    notification.RelatedId,
                    notification.IsRead,
                    notification.CreatedAt))
            .ToList();

        return new GetNotificationsResult(result);
    }
}
