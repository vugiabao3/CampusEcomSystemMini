namespace CampusEcomSystemMini.Application.Connections.SendRequest;

// Phản hồi gửi yêu cầu kết nối.
public record SendRequestResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    string SenderName,
    Guid ReceiverId,
    string ReceiverName,
    string Status,
    DateTime CreatedAt
);

// Kết quả xử lý gửi yêu cầu kết nối.
public enum SendRequestOutcome
{
    Sent,
    SelfRequest,
    ReceiverNotFound,
    DuplicatePending
}

public record SendRequestResult(
    SendRequestOutcome Outcome,
    SendRequestResponse? Response);
