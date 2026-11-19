using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Notifications.GetUnread;

public class GetUnreadHandler
    : IRequestHandler<GetUnreadQuery, GetUnreadResult>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetUnreadHandler(
        INotificationRepository notificationRepository,
        ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetUnreadResult> Handle(
        GetUnreadQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Chỉ đếm thông báo chưa đọc của người dùng
        // đang đăng nhập.
        var unreadCount =
            await _notificationRepository.GetUnreadCountAsync(
                currentUserId,
                cancellationToken);

        return new GetUnreadResult(
            new GetUnreadResponse(unreadCount));
    }
}
