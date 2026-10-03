namespace CampusEcomSystemMini.Application.Leaderboard;

// Một dòng trong bảng xếp hạng.
public record GetLeaderboardResponse(
    int Rank,
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    int ReputationPoints,
    string? Badge
);
