namespace CampusEcomSystemMini.Application.LostFound.Claims.RejectClaim;

// Phản hồi từ chối yêu cầu nhận đồ.
public record RejectClaimResponse(
    Guid ClaimId,
    Guid PostId,
    string Status
);

// Kết quả xử lý từ chối yêu cầu nhận đồ.
public enum RejectClaimOutcome
{
    Rejected,
    ClaimNotFound,
    PostNotFound,
    NotFoundPostType,
    NotOwner,
    NotPending
}

public record RejectClaimResult(
    RejectClaimOutcome Outcome,
    RejectClaimResponse? Response);