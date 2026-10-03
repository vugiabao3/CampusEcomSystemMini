using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.RejectClaim;

// PUT /api/lost-found/claims/{claimId}/reject
// Chỉ chủ bài đăng Found được từ chối yêu cầu nhận đồ.
public record RejectClaimCommand(
    Guid ClaimId
) : IRequest<RejectClaimResult>;