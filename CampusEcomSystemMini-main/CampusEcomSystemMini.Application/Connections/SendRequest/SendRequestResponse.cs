namespace CampusEcomSystemMini.Application.Connections.SendRequest;

// Phản hồi gửi yêu cầu kết nối.
public record SendRequestResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    string SenderName,
    Guid ReceiverId,
    string ReceiverName,
    string Status,
    DateTime CreatedAt,
    Guid? PostId = null,
    string? PostTitle = null
);

// Kết quả xử lý gửi yêu cầu kết nối.
public enum SendRequestOutcome
{
    Sent,
    SelfRequest,
    ReceiverNotFound,
    DuplicatePending,

    // Hai người đã là người kết nối (đã có yêu cầu Accepted).
    AlreadyConnected,

    // PostId không tồn tại.
    PostNotFound,

    // PostId không thuộc về người nhận yêu cầu.
    PostOwnerMismatch
}

public record SendRequestResult(
    SendRequestOutcome Outcome,
    SendRequestResponse? Response);
