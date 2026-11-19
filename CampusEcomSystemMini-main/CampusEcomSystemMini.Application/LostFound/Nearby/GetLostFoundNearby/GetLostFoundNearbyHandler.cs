using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Nearby.GetLostFoundNearby;

public class GetLostFoundNearbyHandler
    : IRequestHandler<GetLostFoundNearbyQuery, GetLostFoundNearbyResponse>
{
    private const string LostPostType = "Lost";
    private const string FoundPostType = "Found";

    private readonly IPostRepository _postRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly IGeoDistanceService _geoDistanceService;

    public GetLostFoundNearbyHandler(
        IPostRepository postRepository,
        ILostFoundRepository lostFoundRepository,
        IGeoDistanceService geoDistanceService)
    {
        _postRepository = postRepository;
        _lostFoundRepository = lostFoundRepository;
        _geoDistanceService = geoDistanceService;
    }

    public async Task<GetLostFoundNearbyResponse> Handle(
        GetLostFoundNearbyQuery request,
        CancellationToken cancellationToken)
    {
        if (!PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new GetLostFoundNearbyResponse(request.Lat, request.Lng, request.RadiusMeters, []);
        }

        var typesToSearch = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Type))
        {
            typesToSearch.Add(LostPostType);
            typesToSearch.Add(FoundPostType);
        }
        else
        {
            var normalizedType = request.Type.Trim();
            if (PostInput.IsLostFoundType(normalizedType))
            {
                typesToSearch.Add(normalizedType);
            }
            else
            {
                return new GetLostFoundNearbyResponse(request.Lat, request.Lng, request.RadiusMeters, []);
            }
        }

        var allPosts = new List<Post>();
        foreach (var type in typesToSearch)
        {
            allPosts.AddRange(await _postRepository.GetAllAsync(type, null, null, cancellationToken));
        }

        var records = await _lostFoundRepository.GetAllAsync(cancellationToken);
        var recordByPostId = records.ToDictionary(x => x.PostId);

        var items = new List<GetLostFoundNearbyItem>();

        foreach (var post in allPosts)
        {
            if (!recordByPostId.TryGetValue(post.Id, out var record))
            {
                continue;
            }

            if (record.Lat is null || record.Lng is null)
            {
                continue;
            }

            var distance = _geoDistanceService.CalculateDistanceMeters(
                request.Lat,
                request.Lng,
                record.Lat.Value,
                record.Lng.Value);

            if (distance > request.RadiusMeters)
            {
                continue;
            }

            var status = string.IsNullOrWhiteSpace(record.Status)
                ? post.Type
                : record.Status;

            items.Add(new GetLostFoundNearbyItem(
                post.Id,
                post.Type,
                post.Title,
                record.Location,
                record.Lat.Value,
                record.Lng.Value,
                status,
                distance,
                post.CreatedAt));
        }

        items.Sort((a, b) => a.DistanceMeters.CompareTo(b.DistanceMeters));

        return new GetLostFoundNearbyResponse(request.Lat, request.Lng, request.RadiusMeters, items);
    }
}