namespace CampusEcomSystemMini.Application.LostFound.Returned;

// Phản hồi xác nhận đã trả đồ.
public record MarkReturnedResponse(
    Guid PostId,
    string Status
);

// Kết quả xử lý đánh dấu đã trả đồ.
public enum MarkReturnedOutcome
{
    Returned,
    PostNotFound,
    NotFoundPostType,
    NotOwner,
    NoApprovedClaim,
    AlreadyReturned
}

public record MarkReturnedResult(
    MarkReturnedOutcome Outcome,
    MarkReturnedResponse? Response);