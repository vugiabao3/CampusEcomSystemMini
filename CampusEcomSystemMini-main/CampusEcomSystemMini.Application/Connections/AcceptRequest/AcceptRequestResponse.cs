namespace CampusEcomSystemMini.Application.Connections.AcceptRequest;

// Phản hồi chấp nhận yêu cầu kết nối.
// ConversationId là cuộc trò chuyện 1-1 được tạo (hoặc đã có sẵn)
// giữa hai người, để frontend mở thẳng Messenger sau khi Accept.
public record AcceptRequestResponse(
    Guid ConnectionRequestId,
    Guid SenderId,
    Guid ReceiverId,
    string Status,
    Guid? ConversationId = null
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
