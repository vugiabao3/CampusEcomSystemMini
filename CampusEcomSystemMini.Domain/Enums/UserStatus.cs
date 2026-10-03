namespace CampusEcomSystemMini.Domain.Enums;

// Trạng thái tài khoản (MODULE_6).
// User.Status lưu đúng các giá trị này.
public static class UserStatus
{
    public const string Active = "Active";

    public const string Blocked = "Blocked";

    public static bool IsValid(string? status)
    {
        return string.Equals(status, Active, System.StringComparison.OrdinalIgnoreCase)
            || string.Equals(status, Blocked, System.StringComparison.OrdinalIgnoreCase);
    }
}