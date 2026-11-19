using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetMap;

public class GetLostFoundMapHandler
    : IRequestHandler<GetLostFoundMapQuery, List<GetLostFoundMapResponse>>
{
    private const string LostPostType = "Lost";

    private const string FoundPostType = "Found";

    private readonly IPostRepository _postRepository;
    private readonly ILostFoundRepository _lostFoundRepository;

    public GetLostFoundMapHandler(
        IPostRepository postRepository,
        ILostFoundRepository lostFoundRepository)
    {
        _postRepository = postRepository;
        _lostFoundRepository = lostFoundRepository;
    }

    public async Task<List<GetLostFoundMapResponse>> Handle(
        GetLostFoundMapQuery request,
        CancellationToken cancellationToken)
    {
        var records = await _lostFoundRepository.GetAllAsync(cancellationToken);

        // Chỉ pin được vị trí có toạ độ thật, không sinh toạ độ.
        var recordsWithCoordinates = records
            .Where(x => x.Lat.HasValue && x.Lng.HasValue)
            .ToList();

        if (recordsWithCoordinates.Count == 0)
        {
            return [];
        }

        var postIds = recordsWithCoordinates
            .Select(x => x.PostId)
            .ToHashSet();

        // Bộ lọc type áp dụng ngay trong truy vấn database.
        var posts = new List<Domain.Entities.Post>();

        foreach (var post in await _postRepository.GetAllAsync(
                     LostPostType,
                     null,
                     null,
                     cancellationToken))
        {
            if (postIds.Contains(post.Id))
            {
                posts.Add(post);
            }
        }

        foreach (var post in await _postRepository.GetAllAsync(
                     FoundPostType,
                     null,
                     null,
                     cancellationToken))
        {
            if (postIds.Contains(post.Id))
            {
                posts.Add(post);
            }
        }

        var postById = posts.ToDictionary(x => x.Id);

        var result = new List<GetLostFoundMapResponse>();

        foreach (var record in recordsWithCoordinates)
        {
            if (!postById.TryGetValue(record.PostId, out var post))
            {
                continue;
            }

            result.Add(
                new GetLostFoundMapResponse(
                    post.Id,
                    post.Title,
                    post.Type,
                    record.Location,
                    record.Lat!.Value,
                    record.Lng!.Value,
                    string.IsNullOrWhiteSpace(record.Status)
                        ? post.Type
                        : record.Status));
        }

        return result
            .OrderByDescending(x => x.Title)
            .ToList();
    }
}