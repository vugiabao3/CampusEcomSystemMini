namespace CampusEcomSystemMini.Application.Gamification;

// Toàn bộ giá trị điểm của MODULE_6 nằm trong một bảng duy nhất.
// Khi workflow đổi số điểm chỉ sửa ở đây, các Handler không
// hard-code lại giá trị.
public static class GamificationPointRules
{
    // Lý do và điểm tương ứng.
    public const string RegisterReason = "Register";

    public const string LostFoundReturnedReason = "LostFound Returned";

    public const string BookExchangeReason = "Book Exchange";

    public const string FiveStarReviewReason = "5★ Review";

    public const string SpamReason = "Spam";

    public const string SeriousViolationReason = "Serious Violation";

    private static readonly Dictionary<string, int> PointByReason =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [RegisterReason] = 100,
            [LostFoundReturnedReason] = 50,
            [BookExchangeReason] = 20,
            [FiveStarReviewReason] = 10,
            [SpamReason] = -20,
            [SeriousViolationReason] = -50
        };

    // Lấy số điểm của một lý do.
    // Trả về false nếu lý do không nằm trong bảng,
    // khi đó không cộng / trừ điểm.
    public static bool TryGetPoints(
        string reason,
        out int points)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            points = 0;

            return false;
        }

        return PointByReason.TryGetValue(
            reason.Trim(),
            out points);
    }

    // Lý do lưu xuống lịch sử điểm đã trim.
    public static string Trim(string reason)
    {
        return string.IsNullOrWhiteSpace(reason)
            ? string.Empty
            : reason.Trim();
    }
}