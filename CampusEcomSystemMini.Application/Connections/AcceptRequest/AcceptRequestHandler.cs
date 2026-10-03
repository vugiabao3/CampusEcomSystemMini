using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.AcceptRequest;

public class AcceptRequestHandler
    : IRequestHandler<AcceptRequestCommand, AcceptRequestResult>
{
    private const string PendingStatus = "Pending";

    private const string AcceptedStatus = "Accepted";

    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public AcceptRequestHandler(
        IConnectionRequestRepository connectionRequestRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _currentUserService = currentUserService;
    }

    public async Task<AcceptRequestResult> Handle(
        AcceptRequestCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var connectionRequest =
            await _connectionRequestRepository.GetByIdAsync(
                request.ConnectionRequestId,
                cancellationToken);

        if (connectionRequest is null)
        {
            return new AcceptRequestResult(
                AcceptRequestOutcome.NotFound,
                null);
        }

        // Chỉ người nhận yêu cầu mới được chấp nhận.
        if (connectionRequest.ReceiverId != currentUserId)
        {
            return new AcceptRequestResult(
                AcceptRequestOutcome.NotReceiver,
                null);
        }

        // Chỉ yêu cầu đang chờ mới được chấp nhận.
        if (!string.Equals(
                connectionRequest.Status,
                PendingStatus,
                StringComparison.OrdinalIgnoreCase))
        {
            return new AcceptRequestResult(
                AcceptRequestOutcome.NotPending,
                null);
        }

        connectionRequest.Status = AcceptedStatus;

        connectionRequest.UpdatedAt = DateTime.UtcNow;

        _connectionRequestRepository.UpdateAsync(
            connectionRequest,
            cancellationToken);

        await _connectionRequestRepository.SaveChangesAsync(
            cancellationToken);

        return new AcceptRequestResult(
            AcceptRequestOutcome.Accepted,
            new AcceptRequestResponse(
                connectionRequest.Id,
                connectionRequest.SenderId,
                connectionRequest.ReceiverId,
                connectionRequest.Status));
    }
}
