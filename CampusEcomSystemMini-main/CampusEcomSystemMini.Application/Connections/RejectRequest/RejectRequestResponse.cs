namespace CampusEcomSystemMini.Application.Connections.RejectRequest;

// Phản hồi từ chối yêu cầu kết nối.
public record RejectRequestResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    Guid ReceiverId,
    string Status
);

// Kết quả xử lý từ chối yêu cầu kết nối.
public enum RejectRequestOutcome
{
    Rejected,
    NotFound,
    NotReceiver,
    NotPending
}

public record RejectRequestResult(
    RejectRequestOutcome Outcome,
    RejectRequestResponse? Response);
