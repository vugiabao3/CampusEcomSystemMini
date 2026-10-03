namespace CampusEcomSystemMini.Domain.Enums;

// Trạng thái báo cáo (MODULE_6).
// Report.Status lưu đúng các giá trị này.
public static class ReportStatus
{
    public const string Pending = "Pending";

    public const string Approved = "Approved";

    public const string Rejected = "Rejected";

    // Báo cáo đã được admin xử lý.
    public static bool IsResolved(string? status)
    {
        return string.Equals(status, Approved, System.StringComparison.OrdinalIgnoreCase)
            || string.Equals(status, Rejected, System.StringComparison.OrdinalIgnoreCase);
    }
}