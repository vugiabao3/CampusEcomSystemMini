using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching;
using CampusEcomSystemMini.Application.Matching.Services;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;

public class GetStudentMatchesHandler
    : IRequestHandler<GetStudentMatchesQuery, List<GetStudentMatchesResponse>>
{
    // Ngưỡng Smart Match: dưới 40% không vào danh sách.
    private const double MinimumMatchScore = 40d;

    // Ngưỡng tạo notification Study Match (MODULE_5 / BATCH 5).
    private const double StudyMatchNotificationScore = 80d;

    private readonly IStudyMatchingService _matchingService;
    private readonly IUserRepository _userRepository;
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public GetStudentMatchesHandler(
        IStudyMatchingService matchingService,
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

    public async Task<List<GetStudentMatchesResponse>> Handle(
        GetStudentMatchesQuery request,
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

        var currentStudy = PreferenceModelConverter.ToStudyPreferences(
            currentUserPreference);

        var candidateUsers =
            await _userRepository.GetAllAsync(cancellationToken);

        var candidatePreferences =
            await _preferenceRepository.GetAllAsync(cancellationToken);

        var preferencesByUserId =
            candidatePreferences.ToDictionary(x => x.UserId);

        var groupPosts = await _postRepository.GetAllAsync(
            "Group", null, null, cancellationToken);

        var groupPostByUserId = new Dictionary<Guid, Post>();
        foreach (var post in groupPosts)
        {
            groupPostByUserId.TryAdd(post.UserId, post);
        }

        var matches = new List<GetStudentMatchesResponse>();

        foreach (var candidate in candidateUsers)
        {
            if (candidate.Id == currentUserId)
            {
                continue;
            }

            preferencesByUserId.TryGetValue(
                candidate.Id,
                out var candidatePreference);

            var candidateStudy =
                PreferenceModelConverter.ToStudyPreferences(candidatePreference);

            var result = _matchingService.Compute(currentStudy, candidateStudy);

            var matchScore = result.Score * 100d;

            if (matchScore < MinimumMatchScore)
            {
                continue;
            }

            Guid? postId = null;
            if (groupPostByUserId.TryGetValue(candidate.Id, out var gp))
            {
                postId = gp.Id;
            }
            else
            {
                var userPosts = await _postRepository.GetByUserIdAsync(candidate.Id, cancellationToken);
                if (userPosts.Count > 0)
                {
                    postId = userPosts[0].Id;
                }
            }

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
                    postId ?? candidate.Id,
                    cancellationToken);
            }

            // Thông báo song hướng: thông báo cho người được ghép về người hiện tại.
            var currentUserName = currentUser?.FullName ?? "người dùng";
            if (matchScore >= StudyMatchNotificationScore &&
                !await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                    candidate.Id,
                    NotificationTypes.StudyMatch,
                    currentUserId,
                    cancellationToken))
            {
                await _notificationService.CreateNotificationAsync(
                    candidate.Id,
                    NotificationTypes.StudyMatch,
                    "Tìm nhóm học phù hợp",
                    $"Bạn phù hợp {matchScore:0.#}% với {currentUserName} cho nhóm học.",
                    postId ?? currentUserId,
                    cancellationToken);
            }

            matches.Add(
                new GetStudentMatchesResponse(
                    candidate.Id,
                    candidate.FullName,
                    candidate.AvatarUrl,
                    (decimal)matchScore,
                    postId));
        }

        return matches
            .OrderByDescending(x => x.MatchScore)
            .ToList();
    }
}
