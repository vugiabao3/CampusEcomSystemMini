using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.AcceptRequest;

public class AcceptRequestHandler
    : IRequestHandler<AcceptRequestCommand, AcceptRequestResult>
{
    private const string PendingStatus = "Pending";

    private const string AcceptedStatus = "Accepted";

    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly ICurrentUserService _currentUserService;

    public AcceptRequestHandler(
        IConnectionRequestRepository connectionRequestRepository,
        IConversationRepository conversationRepository,
        IConversationParticipantRepository participantRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
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

        // MODULE_5 / BATCH 2 flow: đồng ý kết nối
        // → tạo cuộc trò chuyện 1-1 giữa hai người dùng.
        // Không tạo lại nếu hai người đã có cuộc trò chuyện.
        var existingConversation =
            await _conversationRepository.GetBetweenUsersAsync(
                connectionRequest.SenderId,
                connectionRequest.ReceiverId,
                cancellationToken);

        if (existingConversation is null)
        {
            var utcNow = DateTime.UtcNow;

            var conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                CreatedAt = utcNow
            };

            await _conversationRepository.AddAsync(
                conversation,
                cancellationToken);

            await _participantRepository.AddAsync(
                new ConversationParticipant
                {
                    Id = Guid.NewGuid(),
                    ConversationId = conversation.Id,
                    UserId = connectionRequest.SenderId,
                    CreatedAt = utcNow
                },
                cancellationToken);

            await _participantRepository.AddAsync(
                new ConversationParticipant
                {
                    Id = Guid.NewGuid(),
                    ConversationId = conversation.Id,
                    UserId = connectionRequest.ReceiverId,
                    CreatedAt = utcNow
                },
                cancellationToken);
        }

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
