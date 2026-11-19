using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.ApproveClaim;

// PUT /api/lost-found/claims/{claimId}/approve
// Chỉ chủ bài đăng Found được duyệt yêu cầu nhận đồ.
public record ApproveClaimCommand(
    Guid ClaimId
) : IRequest<ApproveClaimResult>;