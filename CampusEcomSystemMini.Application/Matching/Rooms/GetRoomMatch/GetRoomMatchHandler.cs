using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatch;

public class GetRoomMatchHandler
    : IRequestHandler<GetRoomMatchQuery, GetRoomMatchResponse?>
{
    // Ứng viên tìm trọ / ở ghép là người đã đăng bài nhóm Room
    // (Post.Type = "Room"), tái sử dụng dữ liệu Post của Module 1.
    private const string RoomPostType = "Room";

    private readonly IMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetRoomMatchHandler(
        IMatchingService matchingService,
        IUserRepository userRepository,
        IPreferenceRepository preferenceRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _matchingService = matchingService;
        _userRepository = userRepository;
        _preferenceRepository = preferenceRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetRoomMatchResponse?> Handle(
        GetRoomMatchQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var targetUser =
            await _userRepository.GetByIdAsync(
                request.UserId,
                cancellationToken);

        if (targetUser is null)
        {
            return null;
        }

        // Chỉ user có bài đăng Room mới là ứng viên tìm trọ / ở ghép,
        // giữ đúng tập ứng viên mà GET /api/matching/rooms trả về.
        var targetPosts = await _postRepository.GetByUserIdAsync(
            targetUser.Id,
            cancellationToken);

        var roomPostTitle = targetPosts
            .Where(x => string.Equals(
                x.Type,
                RoomPostType,
                StringComparison.OrdinalIgnoreCase))
            .Select(x => x.Title)
            .FirstOrDefault();

        if (roomPostTitle is null)
        {
            return null;
        }

        var currentUserPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var targetPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                targetUser.Id,
                cancellationToken);

        var matchScore = _matchingService.CalculateMatchScore(
            currentUserPreferences,
            targetPreferences);

        return new GetRoomMatchResponse(
            targetUser.Id,
            targetUser.FullName,
            targetUser.AvatarUrl,
            (decimal)matchScore,
            targetPreferences?.PreferredRentalArea,
            targetPreferences?.MonthlyRentalBudget,
            roomPostTitle);
    }
}