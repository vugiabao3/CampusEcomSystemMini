using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.RejectRequest;

public class RejectRequestHandler
    : IRequestHandler<RejectRequestCommand, RejectRequestResult>
{
    private const string PendingStatus = "Pending";

    private const string RejectedStatus = "Rejected";

    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notificationService;
    private readonly ICurrentUserService _currentUserService;

    public RejectRequestHandler(
        IConnectionRequestRepository connectionRequestRepository,
        IUserRepository userRepository,
        INotificationService notificationService,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
        _currentUserService = currentUserService;
    }

    public async Task<RejectRequestResult> Handle(
        RejectRequestCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var connectionRequest =
            await _connectionRequestRepository.GetByIdAsync(
                request.ConnectionRequestId,
                cancellationToken);

        if (connectionRequest is null)
        {
            return new RejectRequestResult(
                RejectRequestOutcome.NotFound,
                null);
        }

        // Chỉ người nhận yêu cầu mới được từ chối.
        if (connectionRequest.ReceiverId != currentUserId)
        {
            return new RejectRequestResult(
                RejectRequestOutcome.NotReceiver,
                null);
        }

        // Chỉ yêu cầu đang chờ mới được từ chối.
        if (!string.Equals(
                connectionRequest.Status,
                PendingStatus,
                StringComparison.OrdinalIgnoreCase))
        {
            return new RejectRequestResult(
                RejectRequestOutcome.NotPending,
                null);
        }

        connectionRequest.Status = RejectedStatus;

        connectionRequest.UpdatedAt = DateTime.UtcNow;

        _connectionRequestRepository.UpdateAsync(
            connectionRequest,
            cancellationToken);

        await _connectionRequestRepository.SaveChangesAsync(
            cancellationToken);

        // MODULE_5 / BATCH 5: tạo notification
        // cho người gửi (Connection Rejected).
        var receiver = await _userRepository.GetByIdAsync(
            connectionRequest.ReceiverId,
            cancellationToken);

        await _notificationService.CreateNotificationAsync(
            connectionRequest.SenderId,
            NotificationTypes.ConnectionRejected,
            "Yêu cầu kết nối đã bị từ chối",
            $"{receiver?.FullName ?? "Sinh viên"} đã từ chối yêu cầu kết nối của bạn.",
            connectionRequest.Id,
            cancellationToken);

        return new RejectRequestResult(
            RejectRequestOutcome.Rejected,
            new RejectRequestResponse(
                connectionRequest.Id,
                connectionRequest.SenderId,
                connectionRequest.ReceiverId,
                connectionRequest.Status));
    }
}
