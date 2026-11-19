using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.MarkMessagesAsRead;

public class MarkMessagesAsReadHandler
    : IRequestHandler<MarkMessagesAsReadCommand, MarkMessagesAsReadResult>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly ICurrentUserService _currentUserService;

    public MarkMessagesAsReadHandler(
        IConversationRepository conversationRepository,
        IConversationParticipantRepository participantRepository,
        IMessageRepository messageRepository,
        ICurrentUserService currentUserService)
    {
        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
        _messageRepository = messageRepository;
        _currentUserService = currentUserService;
    }

    public async Task<MarkMessagesAsReadResult> Handle(
        MarkMessagesAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var conversation =
            await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

        if (conversation is null)
        {
            return new MarkMessagesAsReadResult(
                MarkMessagesAsReadOutcome.NotFound,
                null);
        }

        // Chỉ participant được đánh dấu tin nhắn đã đọc.
        var currentParticipant =
            await _participantRepository.GetByConversationAndUserAsync(
                request.ConversationId,
                currentUserId,
                cancellationToken);

        if (currentParticipant is null)
        {
            return new MarkMessagesAsReadResult(
                MarkMessagesAsReadOutcome.NotParticipant,
                null);
        }

        // Lấy các tin nhắn chưa đọc gửi đến người dùng hiện tại
        // trong cuộc trò chuyện này.
        var messages =
            await _messageRepository.GetUnreadMessagesAsync(
                request.ConversationId,
                currentUserId,
                cancellationToken);

        if (messages.Count == 0)
        {
            return new MarkMessagesAsReadResult(
                MarkMessagesAsReadOutcome.Success,
                new MarkMessagesAsReadResponse(
                    request.ConversationId,
                    0));
        }

        foreach (var message in messages)
        {
            message.IsRead = true;

            _messageRepository.UpdateAsync(
                message,
                cancellationToken);
        }

        await _messageRepository.SaveChangesAsync(
            cancellationToken);

        return new MarkMessagesAsReadResult(
            MarkMessagesAsReadOutcome.Success,
            new MarkMessagesAsReadResponse(
                request.ConversationId,
                messages.Count));
    }
}
