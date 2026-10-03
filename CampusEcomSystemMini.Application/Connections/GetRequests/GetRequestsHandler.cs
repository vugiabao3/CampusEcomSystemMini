using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Connections.GetRequests;

public class GetRequestsHandler
    : IRequestHandler<GetRequestsQuery, GetRequestsResult>
{
    private readonly IConnectionRequestRepository _connectionRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetRequestsHandler(
        IConnectionRequestRepository connectionRequestRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _connectionRequestRepository = connectionRequestRepository;
        _userRepository = userRepository;
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

        var result = new List<GetRequestsResponse>();

        foreach (var connectionRequest in all)
        {
            userById.TryGetValue(
                connectionRequest.SenderId,
                out var sender);

            userById.TryGetValue(
                connectionRequest.ReceiverId,
                out var receiver);

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
                    connectionRequest.UpdatedAt));
        }

        return new GetRequestsResult(result);
    }
}
