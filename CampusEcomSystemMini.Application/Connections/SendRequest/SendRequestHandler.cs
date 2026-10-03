using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.SendRequest;

public class SendRequestHandler
    : IRequestHandler<SendRequestCommand, SendRequestResult>
{
    private const string PendingStatus = "Pending";

    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public SendRequestHandler(
        IConnectionRequestRepository connectionRequestRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<SendRequestResult> Handle(
        SendRequestCommand request,
        CancellationToken cancellationToken)
    {
        // Người gửi luôn lấy từ JWT, không tin client gửi SenderId.
        var senderId = _currentUserService.UserId;

        // Không cho phép gửi yêu cầu kết nối cho chính mình.
        if (request.ReceiverId == senderId)
        {
            return new SendRequestResult(
                SendRequestOutcome.SelfRequest,
                null);
        }

        var sender = await _userRepository.GetByIdAsync(
            senderId,
            cancellationToken);

        var receiver = await _userRepository.GetByIdAsync(
            request.ReceiverId,
            cancellationToken);

        // Người nhận phải tồn tại.
        if (receiver is null)
        {
            return new SendRequestResult(
                SendRequestOutcome.ReceiverNotFound,
                null);
        }

        // Không tạo yêu cầu Pending trùng giữa hai người dùng.
        var existing =
            await _connectionRequestRepository.GetPendingAsync(
                senderId,
                request.ReceiverId,
                cancellationToken);

        if (existing is not null)
        {
            return new SendRequestResult(
                SendRequestOutcome.DuplicatePending,
                null);
        }

        var utcNow = DateTime.UtcNow;

        var connectionRequest = new ConnectionRequest
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            Status = PendingStatus,
            CreatedAt = utcNow,
            UpdatedAt = utcNow
        };

        await _connectionRequestRepository.AddAsync(
            connectionRequest,
            cancellationToken);

        await _connectionRequestRepository.SaveChangesAsync(
            cancellationToken);

        return new SendRequestResult(
            SendRequestOutcome.Sent,
            new SendRequestResponse(
                connectionRequest.Id,
                connectionRequest.SenderId,
                sender?.FullName ?? string.Empty,
                connectionRequest.ReceiverId,
                receiver.FullName,
                connectionRequest.Status,
                connectionRequest.CreatedAt));
    }
}
