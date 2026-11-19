using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching;
using CampusEcomSystemMini.Application.Matching.Services;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatch;

public class GetRoomMatchHandler
    : IRequestHandler<GetRoomMatchQuery, GetRoomMatchResponse?>
{
    private const string RoomPostType = "Room";

    private readonly IRoomMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetRoomMatchHandler(
        IRoomMatchingService matchingService,
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

        var targetPreferenceEntity =
            await _preferenceRepository.GetByUserIdAsync(
                targetUser.Id,
                cancellationToken);

        var targetRoom = PreferenceModelConverter.ToRoomPreferences(targetPreferenceEntity);

        var result = _matchingService.Compute(
            PreferenceModelConverter.ToRoomPreferences(currentUserPreferences),
            targetRoom);

        return new GetRoomMatchResponse(
            targetUser.Id,
            targetUser.FullName,
            targetUser.AvatarUrl,
            (decimal)(result.Score * 100d),
            targetRoom?.Area,
            targetRoom?.Budget?.MinVnd ?? targetRoom?.Budget?.MaxVnd,
            roomPostTitle);
    }
}
