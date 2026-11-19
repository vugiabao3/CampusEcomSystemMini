namespace CampusEcomSystemMini.Application.LostFound.Claims.CreateClaim;

// Phản hồi tạo yêu cầu nhận đồ.
// Không chứa câu trả lời bí mật của người nhặt đồ.
public record CreateClaimResponse(
    Guid ClaimId,
    Guid PostId,
    string Status
);

// Kết quả xử lý tạo yêu cầu nhận đồ.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
public enum CreateClaimOutcome
{
    Created,
    PostNotFound,
    NotFoundPostType,
    IsFinder,
    NoSecretQuestion,
    InvalidAnswer
}

public record CreateClaimResult(
    CreateClaimOutcome Outcome,
    CreateClaimResponse? Response);