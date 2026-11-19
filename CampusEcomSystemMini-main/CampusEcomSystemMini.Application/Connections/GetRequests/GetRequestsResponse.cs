namespace CampusEcomSystemMini.Application.Connections.GetRequests;

// Một yêu cầu kết nối kèm thông tin người gửi / người nhận
// để frontend phân biệt Received / Sent theo current user.
// PostId / PostTitle cho biết yêu cầu phát sinh từ bài đăng nào
// (null khi kết nối được gửi không gắn với bài đăng).
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
    DateTime UpdatedAt,
    Guid? PostId = null,
    string? PostTitle = null
);

public record GetRequestsResult(
    List<GetRequestsResponse> Requests);
