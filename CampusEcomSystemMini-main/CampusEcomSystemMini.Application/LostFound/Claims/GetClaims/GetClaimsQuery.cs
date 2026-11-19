using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.GetClaims;

// GET /api/lost-found/{postId}/claims
// Chỉ chủ bài đăng Found được xem các yêu cầu nhận đồ.
public record GetClaimsQuery(
    Guid PostId
) : IRequest<GetClaimsResult>;