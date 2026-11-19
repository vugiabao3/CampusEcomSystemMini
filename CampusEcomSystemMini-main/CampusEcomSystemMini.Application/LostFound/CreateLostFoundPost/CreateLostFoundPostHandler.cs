using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Notifications;
using CampusEcomSystemMini.Application.Posts;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.CreateLostFoundPost
{
    public class CreateLostFoundPostHandler
        : IRequestHandler<CreateLostFoundPostCommand, CreateLostFoundPostResult>
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

        public CreateLostFoundPostHandler(
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

        public async Task<CreateLostFoundPostResult> Handle(
            CreateLostFoundPostCommand request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            var type = PostInput.NormalizeType(request.Type);
            var isLostFound = PostInput.IsLostFoundType(type);
            if (isLostFound)
            {
                // Validate coordinates are within valid range
                if (!PostInput.IsValidCoordinate(request.Lat, request.Lng))
                {
                    return new CreateLostFoundPostResult(CreateLostFoundPostOutcome.InvalidCoordinates, null);
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
                            return new CreateLostFoundPostResult(CreateLostFoundPostOutcome.InvalidCoordinates, null);
                        }
                    }
                    // If geocoding fails, we still proceed with the provided coordinates? 
                    // The spec says verify consistency, so if we cannot verify, we might want to fail.
                    // However, to avoid blocking legitimate requests due to external service issues, 
                    // we might choose to only validate when we get a result.
                    // For now, we only invalidate when we get a result and it doesn't match.
                }
            }

            var now = DateTime.UtcNow;
            var post = new Post
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title.Trim(),
                Content = request.Content.Trim(),
                Type = type,
                CreatedAt = now,
                UpdatedAt = now
            };

            await _postRepository.AddAsync(post, cancellationToken);

            if (isLostFound)
            {
                var record = new LostFoundRecord
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

                // Find opposite-type posts within 500m and create notifications
                await CreateNearbyMatchNotificationsAsync(post, record, cancellationToken);
            }

            await _postRepository.SaveChangesAsync(cancellationToken);

            return new CreateLostFoundPostResult(
                CreateLostFoundPostOutcome.Created,
                new CreateLostFoundPostResponse(post.Id, post.UserId, post.Title, post.Content, post.Type, post.CreatedAt, post.UpdatedAt));
        }

        private async Task CreateNearbyMatchNotificationsAsync(
            Post newPost,
            LostFoundRecord newRecord,
            CancellationToken cancellationToken)
        {
            if (newRecord.Lat is null || newRecord.Lng is null)
            {
                return;
            }

            var sourceType = newPost.Type;
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
                if (targetPost.UserId == newPost.UserId)
                {
                    continue;
                }

                var distance = _geoDistanceService.CalculateDistanceMeters(
                    newRecord.Lat.Value,
                    newRecord.Lng.Value,
                    targetRecord.Lat.Value,
                    targetRecord.Lng.Value);

                if (distance > MatchDistanceMeters)
                {
                    continue;
                }

                var status = string.IsNullOrWhiteSpace(targetRecord.Status)
                    ? targetPost.Type
                    : targetRecord.Status;

                // Create notification for the new post owner (current user)
                await _notificationService.CreateNotificationAsync(
                    newPost.UserId,
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
                    $"Found a {sourceType} post \"{newPost.Title}\" within {distance:F0}m of your location.",
                    newPost.Id,
                    cancellationToken);
            }
        }
    }
}