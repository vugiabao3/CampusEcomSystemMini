using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching;
using CampusEcomSystemMini.Application.Matching.Services;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatch;

public class GetStudentMatchHandler
    : IRequestHandler<GetStudentMatchQuery, GetStudentMatchResponse?>
{
    private readonly IStudyMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentMatchHandler(
        IStudyMatchingService matchingService,
        IUserRepository userRepository,
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _matchingService = matchingService;
        _userRepository = userRepository;
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetStudentMatchResponse?> Handle(
        GetStudentMatchQuery request,
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

        var currentUserPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var targetPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                targetUser.Id,
                cancellationToken);

        var result = _matchingService.Compute(
            PreferenceModelConverter.ToStudyPreferences(currentUserPreferences),
            PreferenceModelConverter.ToStudyPreferences(targetPreferences));

        return new GetStudentMatchResponse(
            targetUser.Id,
            targetUser.FullName,
            targetUser.AvatarUrl,
            (decimal)(result.Score * 100d));
    }
}
