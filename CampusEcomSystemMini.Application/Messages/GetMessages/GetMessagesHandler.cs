using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Messages.GetMessages;

public class GetMessagesHandler
    : IRequestHandler<GetMessagesQuery, GetMessagesResult>
{
    private const int MaxPageSize = 100;

    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMessagesHandler(
        IConversationRepository conversationRepository,
        IConversationParticipantRepository participantRepository,
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetMessagesResult> Handle(
        GetMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var conversation =
            await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

        if (conversation is null)
        {
            return new GetMessagesResult(
                GetMessagesOutcome.NotFound,
                []);
        }

        // Chỉ participant được xem lịch sử tin nhắn,
        // không để người ngoài đọc nội dung cuộc trò chuyện.
        var currentParticipant =
            await _participantRepository.GetByConversationAndUserAsync(
                conversation.Id,
                currentUserId,
                cancellationToken);

        if (currentParticipant is null)
        {
            return new GetMessagesResult(
                GetMessagesOutcome.NotParticipant,
                []);
        }

        // Bảo vệ phân trang: trang tối thiểu là 1,
        // mỗi trang tối đa 100 tin nhắn.
        var page = request.Page < 1 ? 1 : request.Page;

        var pageSize = request.PageSize < 1
            ? 1
            : Math.Min(request.PageSize, MaxPageSize);

        var messages =
            await _messageRepository.GetByConversationIdAsync(
                conversation.Id,
                page,
                pageSize,
                cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetMessagesResponse>();

        foreach (var message in messages)
        {
            userById.TryGetValue(message.SenderId, out var sender);

            result.Add(
                new GetMessagesResponse(
                    message.Id,
                    message.SenderId,
                    sender?.FullName ?? string.Empty,
                    message.Content,
                    message.SentAt));
        }

        return new GetMessagesResult(
            GetMessagesOutcome.Success,
            result);
    }
}
