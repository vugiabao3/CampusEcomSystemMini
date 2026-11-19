using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Application.Posts;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.UpdateLostFoundPost
{
    public class UpdateLostFoundPostHandler
        : IRequestHandler<UpdateLostFoundPostCommand, UpdateLostFoundPostResult>
    {
        private const string LostPostType = "Lost";
        private const string FoundPostType = "Found";
        private const double MatchDistanceMeters = 500d;

        private readonly IPostRepository _postRepository;
        private readonly ILostFoundRepository _lostFoundRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IGeocodingService _geocodingService;
        private readonly IGeoDistanceService _geoDistanceService;
        private readonly INotificationService _notificationService;

        public UpdateLostFoundPostHandler(
            IPostRepository postRepository,
            ILostFoundRepository lostFoundRepository,
            ICurrentUserService currentUserService,
            IGeocodingService geocodingService,
            IGeoDistanceService geoDistanceService,
            INotificationService notificationService)
        {
            _postRepository = postRepository;
            _lostFoundRepository = lostFoundRepository;
            _currentUserService = currentUserService;
            _geocodingService = geocodingService;
            _geoDistanceService = geoDistanceService;
            _notificationService = notificationService;
        }

        public async Task<UpdateLostFoundPostResult> Handle(UpdateLostFoundPostCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
            if (post is null || post.UserId != userId)
            {
                return new UpdateLostFoundPostResult(UpdateLostFoundPostOutcome.NotFoundOrNotOwner, null);
            }

            var type = PostInput.NormalizeType(request.Type);
            var isLostFound = PostInput.IsLostFoundType(type);
            if (isLostFound)
            {
                // Validate coordinates are within valid range
                if (!PostInput.IsValidCoordinate(request.Lat, request.Lng))
                {
                    return new UpdateLostFoundPostResult(UpdateLostFoundPostOutcome.InvalidCoordinates, null);
                }

                // If location is provided, verify that the coordinates match the address via forward geocoding
                if (!string.IsNullOrWhiteSpace(request.Location))
                {
                    var geocodingResult = await _geocodingService.GeocodeAsync(request.Location.Trim(), cancellationToken);
                    if (geocodingResult != null)
                    {
                        // Allow small tolerance due to floating point and different geocoding sources
                        const double tolerance = 0.001; // ~100 meters
                        if (Math.Abs(geocodingResult.Latitude - request.Lat.Value) > tolerance ||
                            Math.Abs(geocodingResult.Longitude - request.Lng.Value) > tolerance)
                        {
                            return new UpdateLostFoundPostResult(UpdateLostFoundPostOutcome.InvalidCoordinates, null);
                        }
                    }
                }
            }

            post.Title = request.Title.Trim();
            post.Content = request.Content.Trim();
            post.Type = type;
            post.UpdatedAt = DateTime.UtcNow;
            _postRepository.UpdateAsync(post, cancellationToken);

            if (isLostFound)
            {
                var record = await _lostFoundRepository.GetByPostIdAsync(post.Id, cancellationToken);
                var now = DateTime.UtcNow;
                if (record is null)
                {
                    record = new LostFoundRecord
                    {
                        Id = Guid.NewGuid(),
                        PostId = post.Id,
                        Status = type,
                        Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim(),
                        Lat = request.Lat,
                        Lng = request.Lng,
                        CreatedAt = now,
                        UpdatedAt = now
                    };
                    await _lostFoundRepository.AddAsync(record, cancellationToken);
                }
                else
                {
                    if (!string.IsNullOrWhiteSpace(request.Location)) record.Location = request.Location.Trim();
                    if (request.Lat.HasValue) record.Lat = request.Lat.Value;
                    if (request.Lng.HasValue) record.Lng = request.Lng.Value;
                    record.UpdatedAt = now;
                    _lostFoundRepository.UpdateAsync(record, cancellationToken);
                }

                // Find opposite-type posts within 500m and create notifications
                await CreateNearbyMatchNotificationsAsync(post, record, cancellationToken);
            }

            await _postRepository.SaveChangesAsync(cancellationToken);
            return new UpdateLostFoundPostResult(
                UpdateLostFoundPostOutcome.Updated,
                new UpdateLostFoundPostResponse(post.Id, post.UserId, post.Title, post.Content, post.Type, post.CreatedAt, post.UpdatedAt));
        }

        private async Task CreateNearbyMatchNotificationsAsync(
            Post post,
            LostFoundRecord record,
            CancellationToken cancellationToken)
        {
            if (record.Lat is null || record.Lng is null)
            {
                return;
            }

            var sourceType = post.Type;
            var targetType = string.Equals(sourceType, LostPostType, StringComparison.OrdinalIgnoreCase)
                ? FoundPostType
                : LostPostType;

            var targetPosts = await _postRepository.GetAllAsync(targetType, null, null, cancellationToken);
            var targetRecords = await _lostFoundRepository.GetAllAsync(cancellationToken);
            var recordByPostId = targetRecords.ToDictionary(x => x.PostId);

            foreach (var targetPost in targetPosts)
            {
                if (!recordByPostId.TryGetValue(targetPost.Id, out var targetRecord))
                {
                    continue;
                }

                if (targetRecord.Lat is null || targetRecord.Lng is null)
                {
                    continue;
                }

                // Skip if it's the same user's post
                if (targetPost.UserId == post.UserId)
                {
                    continue;
                }

                var distance = _geoDistanceService.CalculateDistanceMeters(
                    record.Lat.Value,
                    record.Lng.Value,
                    targetRecord.Lat.Value,
                    targetRecord.Lng.Value);

                if (distance > MatchDistanceMeters)
                {
                    continue;
                }

                var status = string.IsNullOrWhiteSpace(targetRecord.Status)
                    ? targetPost.Type
                    : targetRecord.Status;

                // Create notification for the current post owner
                await _notificationService.CreateNotificationAsync(
                    post.UserId,
                    NotificationTypes.LostFoundMatch,
                    $"Potential match for your {sourceType} post",
                    $"Found a {status} post \"{targetPost.Title}\" within {distance:F0}m of your location.",
                    targetPost.Id,
                    cancellationToken);

                // Create notification for the existing post owner
                await _notificationService.CreateNotificationAsync(
                    targetPost.UserId,
                    NotificationTypes.LostFoundMatch,
                    $"Potential match for your {status} post",
                    $"Found a {sourceType} post \"{post.Title}\" within {distance:F0}m of your location.",
                    post.Id,
                    cancellationToken);
            }
        }
    }
}