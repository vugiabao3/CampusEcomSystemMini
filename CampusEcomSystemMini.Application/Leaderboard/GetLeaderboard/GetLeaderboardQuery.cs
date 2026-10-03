using MediatR;

namespace CampusEcomSystemMini.Application.Leaderboard;

// GET /api/leaderboard?period=month | year
// Bảng xếp hạng theo điểm uy tín, không nhận userId từ frontend.
public record GetLeaderboardQuery(
    string? Period
) : IRequest<List<GetLeaderboardResponse>>;
