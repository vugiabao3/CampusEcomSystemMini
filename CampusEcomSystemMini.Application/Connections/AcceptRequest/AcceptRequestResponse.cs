namespace CampusEcomSystemMini.Application.Connections.AcceptRequest;

// Phản hồi chấp nhận yêu cầu kết nối.
public record AcceptRequestResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    Guid ReceiverId,
    string Status
);

// Kết quả xử lý chấp nhận yêu cầu kết nối.
public enum AcceptRequestOutcome
{
    Accepted,
    NotFound,
    NotReceiver,
    NotPending
}

public record AcceptRequestResult(
    AcceptRequestOutcome Outcome,
    AcceptRequestResponse? Response);
