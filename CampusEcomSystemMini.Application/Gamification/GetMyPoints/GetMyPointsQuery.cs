using MediatR;

namespace CampusEcomSystemMini.Application.Gamification;

// GET /api/gamification/me
// Điểm uy tín hiện tại của người dùng đang đăng nhập,
// không nhận userId từ frontend.
public record GetMyPointsQuery : IRequest<GetMyPointsResponse?>;
