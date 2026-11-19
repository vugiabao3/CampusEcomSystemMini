using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.GetConversations;

public class GetConversationsHandler
    : IRequestHandler<GetConversationsQuery, GetConversationsResult>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetConversationsHandler(
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

    public async Task<GetConversationsResult> Handle(
        GetConversationsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Chỉ lấy cuộc trò chuyện của người dùng đang đăng nhập.
        var conversations =
            await _conversationRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var items =
            new List<(DateTime SortAt, GetConversationsResponse Response)>();

        foreach (var conversation in conversations)
        {
            var participants =
                await _participantRepository.GetByConversationIdAsync(
                    conversation.Id,
                    cancellationToken);

            // Cuộc trò chuyện 1-1: người kia là participant
            // không phải người dùng đang đăng nhập.
            var otherUserId = participants
                .Where(x => x.UserId != currentUserId)
                .Select(x => x.UserId)
                .FirstOrDefault();

            userById.TryGetValue(otherUserId, out var otherUser);

            var lastMessage =
                await _messageRepository.GetLastMessageAsync(
                    conversation.Id,
                    cancellationToken);

            var unreadCount =
                await _messageRepository.GetUnreadCountAsync(
                    conversation.Id,
                    currentUserId,
                    cancellationToken);

            var response = new GetConversationsResponse(
                conversation.Id,
                otherUserId,
                otherUser?.FullName ?? string.Empty,
                otherUser?.AvatarUrl,
                lastMessage?.Content,
                lastMessage?.SentAt,
                unreadCount);

            // Sắp xếp theo tin nhắn mới nhất,
            // cuộc trò chuyện chưa có tin nhắn theo ngày tạo.
            items.Add((lastMessage?.SentAt ?? conversation.CreatedAt, response));
        }

        return new GetConversationsResult(
            items
                .OrderByDescending(x => x.SortAt)
                .Select(x => x.Response)
                .ToList());
    }
}
