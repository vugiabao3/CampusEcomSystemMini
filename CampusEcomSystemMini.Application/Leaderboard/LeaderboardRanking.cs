using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Leaderboard;

// Quy tắc xếp hạng dùng chung cho
// GET /api/leaderboard và GET /api/leaderboard/me,
// để thứ hạng của hai API luôn khớp nhau.
public static class LeaderboardRanking
{
    public const string MonthPeriod = "month";

    public const string YearPeriod = "year";

    // Chỉ hỗ trợ month và year; giá trị khác dùng month.
    public static string NormalizePeriod(string? period)
    {
        if (string.IsNullOrWhiteSpace(period))
        {
            return MonthPeriod;
        }

        var value = period.Trim().ToLowerInvariant();

        return value switch
        {
            YearPeriod => YearPeriod,
            _ => MonthPeriod
        };
    }

    // Điểm uy tín giảm dần.
    // Tên và Id tăng dần để thứ hạng ổn định khi điểm bằng nhau.
    public static List<User> Order(IEnumerable<User> users)
    {
        return users
            .OrderByDescending(x => x.ReputationPoints)
            .ThenBy(x => x.FullName)
            .ThenBy(x => x.Id)
            .ToList();
    }
}
