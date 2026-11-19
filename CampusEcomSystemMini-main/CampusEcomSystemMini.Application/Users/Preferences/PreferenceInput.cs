namespace CampusEcomSystemMini.Application.Users.Preferences;

// Chuẩn hóa dữ liệu đầu vào của vector nhu cầu.
internal static class PreferenceInput
{
    public static string? NormalizeText(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    public static decimal? NormalizeBudget(decimal? value)
    {
        if (!value.HasValue || value.Value < 0)
        {
            return null;
        }

        return value.Value;
    }
}