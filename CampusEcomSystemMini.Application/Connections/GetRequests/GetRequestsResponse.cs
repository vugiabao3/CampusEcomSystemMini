namespace CampusEcomSystemMini.Application.Connections.GetRequests;

// Một yêu cầu kết nối kèm thông tin người gửi / người nhận
// để frontend phân biệt Received / Sent theo current user.
public record GetRequestsResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    string SenderName,
    string? SenderAvatarUrl,
    Guid ReceiverId,
    string ReceiverName,
    string? ReceiverAvatarUrl,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record GetRequestsResult(
    List<GetRequestsResponse> Requests);
