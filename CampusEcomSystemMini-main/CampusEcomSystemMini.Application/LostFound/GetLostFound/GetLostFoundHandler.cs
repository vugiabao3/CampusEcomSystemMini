using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetLostFound;

public class GetLostFoundHandler
    : IRequestHandler<GetLostFoundQuery, List<GetLostFoundResponse>>
{
    private const string LostPostType = "Lost";

    private const string FoundPostType = "Found";

    private const double LostFoundMatchDistanceMeters = 500d;

    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;
    private readonly IGeoDistanceService _geoDistanceService;

    public GetLostFoundHandler(
        IPostRepository postRepository,
        IUserRepository userRepository,
        ILostFoundRepository lostFoundRepository,
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository,
        INotificationService notificationService,
        IGeoDistanceService geoDistanceService)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _lostFoundRepository = lostFoundRepository;
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
        _geoDistanceService = geoDistanceService;
    }

    public async Task<List<GetLostFoundResponse>> Handle(
        GetLostFoundQuery request,
        CancellationToken cancellationToken)
    {
        var type = string.IsNullOrWhiteSpace(request.Type)
            ? null
            : request.Type.Trim();

        var status = string.IsNullOrWhiteSpace(request.Status)
            ? null
            : request.Status.Trim();

        // Bộ lọc type áp dụng ngay trong truy vấn database.
        var posts = new List<Domain.Entities.Post>();

        if (type is null ||
            string.Equals(type, LostPostType, StringComparison.OrdinalIgnoreCase))
        {
            posts.AddRange(await _postRepository.GetAllAsync(
                LostPostType,
                null,
                null,
                cancellationToken));
        }

        if (type is null ||
            string.Equals(type, FoundPostType, StringComparison.OrdinalIgnoreCase))
        {
            posts.AddRange(await _postRepository.GetAllAsync(
                FoundPostType,
                null,
                null,
                cancellationToken));
        }

        if (posts.Count == 0)
        {
            return [];
        }

        var records = await _lostFoundRepository.GetAllAsync(cancellationToken);

        var recordByPostId = records.ToDictionary(x => x.PostId);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetLostFoundResponse>();

        foreach (var post in posts)
        {
            recordByPostId.TryGetValue(post.Id, out var record);

            // Chưa có bản ghi Lost & Found thì trạng thái lấy
            // theo Post.Type (Lost / Found).
            var currentStatus = string.IsNullOrWhiteSpace(record?.Status)
                ? post.Type
                : record.Status;

            if (status is not null &&
                !string.Equals(
                    status,
                    currentStatus,
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            userById.TryGetValue(post.UserId, out var user);

            result.Add(
                new GetLostFoundResponse(
                    post.Id,
                    post.UserId,
                    user?.FullName ?? string.Empty,
                    post.Type,
                    post.Title,
                    post.Content,
                    record?.Location,
                    record?.Lat,
                    record?.Lng,
                    currentStatus,
                    post.CreatedAt));
        }

        // MODULE_5 / BATCH 5: Lost & Found matching
        // (Haversine distance <= 500m) → tạo notification
        // cho người dùng đang đăng nhập. Module 3 chịu
        // trách nhiệm matching, Module 5 chỉ nhận kết quả.
        await CreateLostFoundMatchNotificationsAsync(
            posts,
            recordByPostId,
            cancellationToken);

        return result
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    // So khớp bài Lost của người dùng với bài Found của
    // người khác và ngược lại, trong bán kính 500m.
    private async Task CreateLostFoundMatchNotificationsAsync(
        List<Domain.Entities.Post> posts,
        Dictionary<Guid, Domain.Entities.LostFoundRecord> recordByPostId,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Bài đăng có toạ độ thật mới tính khoảng cách.
        var lostWithCoordinates = posts
            .Where(x => string.Equals(
                x.Type, LostPostType, StringComparison.OrdinalIgnoreCase))
            .Select(x => (Post: x, Record: recordByPostId.TryGetValue(x.Id, out var r) ? r : null))
            .Where(x => x.Record?.Lat.HasValue == true &&
                        x.Record?.Lng.HasValue == true)
            .ToList();

        var foundWithCoordinates = posts
            .Where(x => string.Equals(
                x.Type, FoundPostType, StringComparison.OrdinalIgnoreCase))
            .Select(x => (Post: x, Record: recordByPostId.TryGetValue(x.Id, out var r) ? r : null))
            .Where(x => x.Record?.Lat.HasValue == true &&
                        x.Record?.Lng.HasValue == true)
            .ToList();

        // Bài Lost của chính người dùng → tìm bài Found
        // của người khác trong bán kính 500m.
        foreach (var lost in lostWithCoordinates.Where(x => x.Post.UserId == currentUserId))
        {
            foreach (var found in foundWithCoordinates.Where(x => x.Post.UserId != currentUserId))
            {
                if (_geoDistanceService.CalculateDistanceMeters(
                        lost.Record!.Lat!.Value,
                        lost.Record!.Lng!.Value,
                        found.Record!.Lat!.Value,
                        found.Record!.Lng!.Value) > LostFoundMatchDistanceMeters)
                {
                    continue;
                }

                if (await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                        currentUserId,
                        NotificationTypes.LostFoundMatch,
                        found.Post.Id,
                        cancellationToken))
                {
                    continue;
                }

                await _notificationService.CreateNotificationAsync(
                    currentUserId,
                    NotificationTypes.LostFoundMatch,
                    "Tìm thấy đồ gần bạn",
                    $"Bài đăng \"{found.Post.Title}\" nhặt được đồ cách vị trí mất đồ của bạn không quá 500m.",
                    found.Post.Id,
                    cancellationToken);
            }
        }

        // Bài Found của chính người dùng → tìm bài Lost
        // của người khác trong bán kính 500m.
        foreach (var found in foundWithCoordinates.Where(x => x.Post.UserId == currentUserId))
        {
            foreach (var lost in lostWithCoordinates.Where(x => x.Post.UserId != currentUserId))
            {
                if (_geoDistanceService.CalculateDistanceMeters(
                        found.Record!.Lat!.Value,
                        found.Record!.Lng!.Value,
                        lost.Record!.Lat!.Value,
                        lost.Record!.Lng!.Value) > LostFoundMatchDistanceMeters)
                {
                    continue;
                }

                if (await _notificationRepository.ExistsByUserAndRelatedIdAsync(
                        currentUserId,
                        NotificationTypes.LostFoundMatch,
                        lost.Post.Id,
                        cancellationToken))
                {
                    continue;
                }

                await _notificationService.CreateNotificationAsync(
                    currentUserId,
                    NotificationTypes.LostFoundMatch,
                    "Tìm thấy đồ gần bạn",
                    $"Bài đăng \"{lost.Post.Title}\" báo mất đồ cách vị trí nhặt được của bạn không quá 500m.",
                    lost.Post.Id,
                    cancellationToken);
            }
        }
    }
}