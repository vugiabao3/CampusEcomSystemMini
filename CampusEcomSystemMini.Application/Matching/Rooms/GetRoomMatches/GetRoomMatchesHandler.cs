using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatches;

public class GetRoomMatchesHandler
    : IRequestHandler<GetRoomMatchesQuery, List<GetRoomMatchesResponse>>
{
    // Ngưỡng Smart Match của Module 2: dưới 40% không vào danh sách.
    private const double MinimumMatchScore = 40d;

    // Ngưỡng tạo notification Room Match (MODULE_5 / BATCH 5).
    private const double RoomMatchNotificationScore = 80d;

    // Ứng viên tìm trọ / ở ghép là người đã đăng bài nhóm Room
    // (Post.Type = "Room"), tái sử dụng dữ liệu Post của Module 1.
    private const string RoomPostType = "Room";

    private readonly IMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public GetRoomMatchesHandler(
        IMatchingService matchingService,
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

        var currentUserPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        // Ứng viên phòng trọ: những user có ít nhất một bài đăng Room.
        var roomPosts = await _postRepository.GetAllAsync(
            RoomPostType,
            null,
            null,
            cancellationToken);

        if (roomPosts.Count == 0)
        {
            return [];
        }

        // Bài Room mới nhất của mỗi user là bài đại diện cho nhu cầu
        // tìm trọ / ở ghép (GetAllAsync đã sắp xếp CreatedAt DESC).
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
            // Không đưa chính mình vào danh sách ứng viên.
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

            var matchScore = _matchingService.CalculateMatchScore(
                currentUserPreferences,
                candidatePreference);

            if (matchScore < MinimumMatchScore)
            {
                continue;
            }

            // MODULE_5 / BATCH 5: Room Match >= 80%
            // → tạo notification cho người dùng đang
            // đăng nhập. Không tạo trùng (user + type
            // + related user).
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
                    candidate.Id,
                    cancellationToken);
            }

            matches.Add(
                new GetRoomMatchesResponse(
                    candidate.Id,
                    candidate.FullName,
                    candidate.AvatarUrl,
                    (decimal)matchScore,
                    candidatePreference?.PreferredRentalArea,
                    candidatePreference?.MonthlyRentalBudget,
                    roomPost.Title));
        }

        return matches
            .OrderByDescending(x => x.MatchScore)
            .ToList();
    }
}