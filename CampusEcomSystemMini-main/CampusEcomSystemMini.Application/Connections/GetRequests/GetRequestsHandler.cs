using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.GetRequests;

public class GetRequestsHandler
    : IRequestHandler<GetRequestsQuery, GetRequestsResult>
{
    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetRequestsHandler(
        IConnectionRequestRepository connectionRequestRepository,
        IUserRepository userRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _userRepository = userRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetRequestsResult> Handle(
        GetRequestsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        // Lấy tất cả yêu cầu liên quan đến người dùng đang đăng nhập:
        // nhận được (Receiver) và đã gửi (Sender).
        var received =
            await _connectionRequestRepository.GetByReceiverIdAsync(
                currentUserId,
                cancellationToken);

        var sent =
            await _connectionRequestRepository.GetBySenderIdAsync(
                currentUserId,
                cancellationToken);

        var all = received
            .Concat(sent)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        // Tiêu đề các bài đăng được gắn vào yêu cầu kết nối,
        // lấy trong một truy vấn cho toàn bộ danh sách.
        var postIds = all
            .Where(x => x.PostId.HasValue)
            .Select(x => x.PostId!.Value)
            .Distinct()
            .ToList();

        var postIdsNonEmpty = postIds.Where(x => x != Guid.Empty).ToList();

        var posts = postIdsNonEmpty.Count == 0
            ? new List<Post>()
            : await _postRepository.GetByIdsAsync(
                postIdsNonEmpty,
                cancellationToken);

        var postById = posts.ToDictionary(x => x.Id);

        var result = new List<GetRequestsResponse>();

        foreach (var connectionRequest in all)
        {
            userById.TryGetValue(
                connectionRequest.SenderId,
                out var sender);

            userById.TryGetValue(
                connectionRequest.ReceiverId,
                out var receiver);

            Post? relatedPost = null;

            if (connectionRequest.PostId.HasValue)
            {
                postById.TryGetValue(
                    connectionRequest.PostId.Value,
                    out relatedPost);
            }

            result.Add(
                new GetRequestsResponse(
                    connectionRequest.Id,
                    connectionRequest.SenderId,
                    sender?.FullName ?? string.Empty,
                    sender?.AvatarUrl,
                    connectionRequest.ReceiverId,
                    receiver?.FullName ?? string.Empty,
                    receiver?.AvatarUrl,
                    connectionRequest.Status,
                    connectionRequest.CreatedAt,
                    connectionRequest.UpdatedAt,
                    connectionRequest.PostId,
                    relatedPost?.Title));
        }

        return new GetRequestsResult(result);
    }
}
