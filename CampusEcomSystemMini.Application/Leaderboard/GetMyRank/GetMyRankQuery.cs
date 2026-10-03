using MediatR;

namespace CampusEcomSystemMini.Application.Leaderboard;

// GET /api/leaderboard/me?period=month | year
// Thứ hạng của chính người dùng đang đăng nhập.
// period là tham số tuỳ chọn, mặc định month.
public record GetMyRankQuery(
    string? Period
) : IRequest<GetMyRankResponse?>;
