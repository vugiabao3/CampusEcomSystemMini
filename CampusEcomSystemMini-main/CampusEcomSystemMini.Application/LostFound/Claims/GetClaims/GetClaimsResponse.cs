namespace CampusEcomSystemMini.Application.LostFound.Claims.GetClaims;

// Chỉ trả về thông tin yêu cầu nhận đồ mà Finder cần xem.
// Không trả về câu trả lời bí mật hay dữ liệu nhạy cảm.
public record GetClaimsResponse(
    Guid ClaimId,
    Guid PostId,
    Guid ClaimantUserId,
    string FullName,
    string Status,
    DateTime CreatedAt
);

// Kết quả xử lý lấy danh sách yêu cầu nhận đồ.
// Phân biệt "không được phép" với "chưa có yêu cầu nào".
public enum GetClaimsOutcome
{
    Success,
    PostNotFound,
    NotFoundPostType,
    NotOwner
}

public record GetClaimsResult(
    GetClaimsOutcome Outcome,
    List<GetClaimsResponse> Claims);