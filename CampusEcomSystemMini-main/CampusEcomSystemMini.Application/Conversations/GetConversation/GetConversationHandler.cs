using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Conversations.GetConversation;

public class GetConversationHandler
    : IRequestHandler<GetConversationQuery, GetConversationResult>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetConversationHandler(
        IConversationRepository conversationRepository,
        IConversationParticipantRepository participantRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetConversationResult> Handle(
        GetConversationQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var conversation =
            await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

        if (conversation is null)
        {
            return new GetConversationResult(
                GetConversationOutcome.NotFound,
                null);
        }

        // Chỉ participant được xem cuộc trò chuyện,
        // không để người ngoài đọc nội dung.
        var currentParticipant =
            await _participantRepository.GetByConversationAndUserAsync(
                conversation.Id,
                currentUserId,
                cancellationToken);

        if (currentParticipant is null)
        {
            return new GetConversationResult(
                GetConversationOutcome.NotParticipant,
                null);
        }

        var participants =
            await _participantRepository.GetByConversationIdAsync(
                conversation.Id,
                cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var participantResponses = new List<ConversationParticipantResponse>();

        foreach (var participant in participants)
        {
            userById.TryGetValue(participant.UserId, out var user);

            participantResponses.Add(
                new ConversationParticipantResponse(
                    participant.UserId,
                    user?.FullName ?? string.Empty,
                    user?.AvatarUrl));
        }

        return new GetConversationResult(
            GetConversationOutcome.Success,
            new GetConversationResponse(
                conversation.Id,
                participantResponses));
    }
}
