using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;

public class GetStudentMatchesHandler
    : IRequestHandler<GetStudentMatchesQuery, List<GetStudentMatchesResponse>>
{
    // Ngưỡng Smart Match của Module 2: dưới 40% không vào danh sách.
    private const double MinimumMatchScore = 40d;

    // Ngưỡng tạo notification Study Match (MODULE_5 / BATCH 5).
    private const double StudyMatchNotificationScore = 80d;

    private readonly IMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public GetStudentMatchesHandler(
        IMatchingService matchingService,
        IUserRepository userRepository,
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _matchingService = matchingService;
        _userRepository = userRepository;
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
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

            // MODULE_5 / BATCH 5: Study Match >= 80%
            // → tạo notification cho người dùng đang
            // đăng nhập. Không tạo trùng (user + type
            // + related user).
            if (matchScore >= StudyMatchNotificationScore &&
                !await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                    currentUserId,
                    NotificationTypes.StudyMatch,
                    candidate.Id,
                    cancellationToken))
            {
                await _notificationService.CreateNotificationAsync(
                    currentUserId,
                    NotificationTypes.StudyMatch,
                    "Tìm nhóm học phù hợp",
                    $"Tìm thấy {candidate.FullName} phù hợp {matchScore:0.#}% cho nhóm học của bạn.",
                    candidate.Id,
                    cancellationToken);
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