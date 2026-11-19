namespace CampusEcomSystemMini.Application.LostFound.Claims.ApproveClaim;

// Phản hồi duyệt yêu cầu nhận đồ.
public record ApproveClaimResponse(
    Guid ClaimId,
    Guid PostId,
    string Status
);

// Kết quả xử lý duyệt yêu cầu nhận đồ.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
public enum ApproveClaimOutcome
{
    Approved,
    ClaimNotFound,
    PostNotFound,
    NotFoundPostType,
    NotOwner,
    NotPending
}

public record ApproveClaimResult(
    ApproveClaimOutcome Outcome,
    ApproveClaimResponse? Response);