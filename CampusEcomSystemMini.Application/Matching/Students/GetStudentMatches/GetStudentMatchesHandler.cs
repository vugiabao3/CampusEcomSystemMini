using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;

public class GetStudentMatchesHandler
    : IRequestHandler<GetStudentMatchesQuery, List<GetStudentMatchesResponse>>
{
    // Ngưỡng Smart Match của Module 2: dưới 40% không vào danh sách.
    private const double MinimumMatchScore = 40d;

    private readonly IMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentMatchesHandler(
        IMatchingService matchingService,
        IUserRepository userRepository,
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _matchingService = matchingService;
        _userRepository = userRepository;
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetStudentMatchesResponse>> Handle(
        GetStudentMatchesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var currentUserPreferences =
            await _preferenceRepository.GetByUserIdAsync(
                currentUserId,
                cancellationToken);

        var candidateUsers =
            await _userRepository.GetAllAsync(cancellationToken);

        var candidatePreferences =
            await _preferenceRepository.GetAllAsync(cancellationToken);

        var preferencesByUserId =
            candidatePreferences.ToDictionary(x => x.UserId);

        var matches = new List<GetStudentMatchesResponse>();

        foreach (var candidate in candidateUsers)
        {
            // Không đưa chính mình vào danh sách ứng viên.
            if (candidate.Id == currentUserId)
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

            matches.Add(
                new GetStudentMatchesResponse(
                    candidate.Id,
                    candidate.FullName,
                    candidate.AvatarUrl,
                    (decimal)matchScore));
        }

        return matches
            .OrderByDescending(x => x.MatchScore)
            .ToList();
    }
}