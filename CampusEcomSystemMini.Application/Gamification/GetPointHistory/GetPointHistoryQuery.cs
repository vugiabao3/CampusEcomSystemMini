using MediatR;

namespace CampusEcomSystemMini.Application.Gamification;

// GET /api/gamification/history
// Lịch sử điểm của chính người dùng đang đăng nhập.
public record GetPointHistoryQuery
    : IRequest<List<GetPointHistoryResponse>>;
