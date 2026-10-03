namespace CampusEcomSystemMini.Application.Leaderboard;

// Thứ hạng của người dùng đang đăng nhập.
public record GetMyRankResponse(
    int Rank,
    int ReputationPoints,
    string Period,
    string? Badge
);
