using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetLostFound;

public class GetLostFoundHandler
    : IRequestHandler<GetLostFoundQuery, List<GetLostFoundResponse>>
{
    // Hai nhóm bài đăng thuộc Lost & Found, tái sử dụng Post
    // của Module 1 thay vì tạo bảng bài đăng riêng.
    private const string LostPostType = "Lost";

    private const string FoundPostType = "Found";

    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILostFoundRepository _lostFoundRepository;

    public GetLostFoundHandler(
        IPostRepository postRepository,
        IUserRepository userRepository,
        ILostFoundRepository lostFoundRepository)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _lostFoundRepository = lostFoundRepository;
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

        return result
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }
}