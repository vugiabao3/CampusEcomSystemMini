using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Matches.GetLostFoundMatches;

public class GetLostFoundMatchesHandler
    : IRequestHandler<GetLostFoundMatchesQuery, GetLostFoundMatchesResponse>
{
    private const string LostPostType = "Lost";
    private const string FoundPostType = "Found";
    private const double DefaultMaxDistanceMeters = 500d;

    private readonly IPostRepository _postRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly IGeoDistanceService _geoDistanceService;

    public GetLostFoundMatchesHandler(
        IPostRepository postRepository,
        ILostFoundRepository lostFoundRepository,
        IGeoDistanceService geoDistanceService)
    {
        _postRepository = postRepository;
        _lostFoundRepository = lostFoundRepository;
        _geoDistanceService = geoDistanceService;
    }

    public async Task<GetLostFoundMatchesResponse> Handle(
        GetLostFoundMatchesQuery request,
        CancellationToken cancellationToken)
    {
        var sourcePost = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
        if (sourcePost is null)
        {
            return new GetLostFoundMatchesResponse(request.PostId, string.Empty, []);
        }

        var sourceRecord = await _lostFoundRepository.GetByPostIdAsync(request.PostId, cancellationToken);
        if (sourceRecord?.Lat is null || sourceRecord?.Lng is null)
        {
            return new GetLostFoundMatchesResponse(request.PostId, sourcePost.Type, []);
        }

        var sourceType = sourcePost.Type;
        var targetType = string.Equals(sourceType, LostPostType, StringComparison.OrdinalIgnoreCase)
            ? FoundPostType
            : LostPostType;

        var targetPosts = await _postRepository.GetAllAsync(targetType, null, null, cancellationToken);

        var targetRecords = await _lostFoundRepository.GetAllAsync(cancellationToken);
        var recordByPostId = targetRecords.ToDictionary(x => x.PostId);

        var matches = new List<GetLostFoundMatchItem>();

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

            var distance = _geoDistanceService.CalculateDistanceMeters(
                sourceRecord.Lat.Value,
                sourceRecord.Lng.Value,
                targetRecord.Lat.Value,
                targetRecord.Lng.Value);

            if (distance > DefaultMaxDistanceMeters)
            {
                continue;
            }

            var status = string.IsNullOrWhiteSpace(targetRecord.Status)
                ? targetPost.Type
                : targetRecord.Status;

            matches.Add(new GetLostFoundMatchItem(
                targetPost.Id,
                targetPost.Type,
                targetPost.Title,
                targetRecord.Location,
                targetRecord.Lat.Value,
                targetRecord.Lng.Value,
                status,
                distance,
                targetPost.CreatedAt));
        }

        matches.Sort((a, b) => a.DistanceMeters.CompareTo(b.DistanceMeters));

        return new GetLostFoundMatchesResponse(request.PostId, sourceType, matches);
    }
}