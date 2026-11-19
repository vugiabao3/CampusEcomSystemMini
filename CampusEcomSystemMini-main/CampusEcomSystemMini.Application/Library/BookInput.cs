namespace CampusEcomSystemMini.Application.Library;

// Chuẩn hóa dữ liệu đầu vào của bài đăng đổi sách.
// Trạng thái do Backend quản lý, không nhận từ frontend.
internal static class BookInput
{
    // Trạng thái khởi tạo của một bài đăng đổi sách.
    public const string OpenStatus = "Open";

    public static string? NormalizeSearch(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    public static string? NormalizeStatus(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }
}
