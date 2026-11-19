namespace CampusEcomSystemMini.Application.Posts;

// Chuẩn hóa dữ liệu đầu vào của bài đăng.
internal static class PostInput
{
    public static string? NormalizeType(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        var lower = trimmed.ToLowerInvariant();

        if (lower == FoundType.ToLowerInvariant()) return FoundType;
        if (lower == LostType.ToLowerInvariant()) return LostType;

        return trimmed;
    }

    // MODULE_3: hai loại bài đăng có dữ liệu vị trí riêng
    // (LostFoundRecord). So sánh không phân biệt hoa thường vì
    // PostType của Module 3 viết hoa chữ đầu.
    public const string LostType = "Lost";

    public const string FoundType = "Found";

    public static bool IsLostFoundType(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var trimmed = value.Trim();

        return string.Equals(
                trimmed,
                LostType,
                StringComparison.OrdinalIgnoreCase) ||
               string.Equals(
                trimmed,
                FoundType,
                StringComparison.OrdinalIgnoreCase);
    }

    // MODULE_3: tọa độ phải là toạ độ thật trên Trái Đất.
    // Trả về false nếu Lat vượt [-90, 90] hoặc Lng vượt [-180, 180].
    public static bool IsValidCoordinate(double? lat, double? lng)
    {
        // Chỉ một trong hai có giá trị thì không hợp lệ.
        if (lat.HasValue != lng.HasValue)
        {
            return false;
        }

        if (!lat.HasValue)
        {
            // Cả hai đều null: không có toạ độ thì hợp lệ.
            return true;
        }

        return lat.Value is >= -90 and <= 90 &&
               lng!.Value is >= -180 and <= 180;
    }
}