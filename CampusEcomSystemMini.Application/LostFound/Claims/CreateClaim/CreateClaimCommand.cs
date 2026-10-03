using System.ComponentModel.DataAnnotations;

using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.CreateClaim;

// POST /api/lost-found/{postId}/claims
// Người bị mất đồ trả lời câu hỏi bí mật để nhận lại đồ.
// ClaimantUserId lấy từ ICurrentUserService, không nhận từ
// frontend. Câu trả lời không bao giờ được trả về hoặc ghi log.
public record CreateClaimCommand(
    Guid PostId,
    [Required] string Answer
) : IRequest<CreateClaimResult>;