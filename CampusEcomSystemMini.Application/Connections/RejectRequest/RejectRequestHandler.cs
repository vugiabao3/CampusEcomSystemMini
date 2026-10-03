using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.RejectRequest;

public class RejectRequestHandler
    : IRequestHandler<RejectRequestCommand, RejectRequestResult>
{
    private const string PendingStatus = "Pending";

    private const string RejectedStatus = "Rejected";

    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public RejectRequestHandler(
        IConnectionRequestRepository connectionRequestRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
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

        return new RejectRequestResult(
            RejectRequestOutcome.Rejected,
            new RejectRequestResponse(
                connectionRequest.Id,
                connectionRequest.SenderId,
                connectionRequest.ReceiverId,
                connectionRequest.Status));
    }
}
