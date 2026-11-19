using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching;
using CampusEcomSystemMini.Application.Matching.Services;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatches;

public class GetRoomMatchesHandler
    : IRequestHandler<GetRoomMatchesQuery, List<GetRoomMatchesResponse>>
{
    private const double MinimumMatchScore = 40d;

    private const double RoomMatchNotificationScore = 80d;

    private const string RoomPostType = "Room";

    private readonly IRoomMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public GetRoomMatchesHandler(
        IRoomMatchingService matchingService,
        IUserRepository userRepository,
        IPreferenceRepository preferenceRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _matchingService = matchingService;
        _userRepository = userRepository;
        _preferenceRepository = preferenceRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<List<GetRoomMatchesResponse>> Handle(
        GetRoomMatchesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var currentUserPreference =
            await _preferenceRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var currentUser =
            await _userRepository.GetByIdAsync(
                currentUserId,
                cancellationToken);

        var currentRoom = PreferenceModelConverter.ToRoomPreferences(
            currentUserPreference);

        var roomPosts = await _postRepository.GetAllAsync(
            RoomPostType,
            null,
            null,
            cancellationToken);

        if (roomPosts.Count == 0)
        {
            return [];
        }

        var roomPostByUserId = new Dictionary<Guid, Post>();

        foreach (var roomPost in roomPosts)
        {
            roomPostByUserId.TryAdd(roomPost.UserId, roomPost);
        }

        var candidateUsers =
            await _userRepository.GetAllAsync(cancellationToken);

        var candidatePreferences =
            await _preferenceRepository.GetAllAsync(cancellationToken);

        var preferencesByUserId =
            candidatePreferences.ToDictionary(x => x.UserId);

        var matches = new List<GetRoomMatchesResponse>();

        foreach (var candidate in candidateUsers)
        {
            if (candidate.Id == currentUserId)
            {
                continue;
            }

            if (!roomPostByUserId.TryGetValue(
                    candidate.Id,
                    out var roomPost))
            {
                continue;
            }

            preferencesByUserId.TryGetValue(
                candidate.Id,
                out var candidatePreference);

            var candidateRoom =
                PreferenceModelConverter.ToRoomPreferences(candidatePreference);

            var result = _matchingService.Compute(currentRoom, candidateRoom);

            var matchScore = result.Score * 100d;

            if (matchScore < MinimumMatchScore)
            {
                continue;
            }

            if (matchScore >= RoomMatchNotificationScore &&
                !await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                    currentUserId,
                    NotificationTypes.RoomMatch,
                    candidate.Id,
                    cancellationToken))
            {
                await _notificationService.CreateNotificationAsync(
                    currentUserId,
                    NotificationTypes.RoomMatch,
                    "Tìm trọ / Ở ghép phù hợp",
                    $"Tìm thấy {candidate.FullName} phù hợp {matchScore:0.#}% cho nhu cầu tìm trọ / ở ghép của bạn.",
                    roomPost.Id,
                    cancellationToken);
            }

            // Thông báo song hướng: thông báo cho người được ghép về người hiện tại.
            var currentUserName = currentUser?.FullName ?? "người dùng";
            if (matchScore >= RoomMatchNotificationScore &&
                !await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                    candidate.Id,
                    NotificationTypes.RoomMatch,
                    currentUserId,
                    cancellationToken))
            {
                await _notificationService.CreateNotificationAsync(
                    candidate.Id,
                    NotificationTypes.RoomMatch,
                    "Tìm trọ / Ở ghép phù hợp",
                    $"Bạn phù hợp {matchScore:0.#}% với {currentUserName} cho nhu cầu tìm trọ / ở ghép.",
                    roomPost.Id,
                    cancellationToken);
            }

            matches.Add(
                new GetRoomMatchesResponse(
                    candidate.Id,
                    candidate.FullName,
                    candidate.AvatarUrl,
                    (decimal)matchScore,
                    candidateRoom?.Area,
                    candidateRoom?.Budget?.MinVnd ?? candidateRoom?.Budget?.MaxVnd,
                    roomPost.Title,
                    roomPost.Id));
        }

        return matches
            .OrderByDescending(x => x.MatchScore)
            .ToList();
    }
}
