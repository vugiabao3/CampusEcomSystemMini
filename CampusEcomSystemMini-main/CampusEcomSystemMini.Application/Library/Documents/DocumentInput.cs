namespace CampusEcomSystemMini.Application.Library.Documents;

// Chuẩn hóa dữ liệu đầu vào của tài liệu số.
// Rating và ReviewCount do batch Reviews cập nhật,
// không nhận từ frontend.
internal static class DocumentInput
{
    // Tài liệu miễn phí không trừ điểm.
    public const string FreePricingType = "Free";

    // Tài liệu trả phí, giá tính bằng điểm.
    public const string PaidPricingType = "Paid";

    public static string? NormalizeSearch(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    public static string? NormalizeSubject(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    // Chuyển enum PricingType sang chuỗi lưu trong database.
    public static string PricingTypeToString(
        DocumentPricingType pricingType)
    {
        return pricingType == DocumentPricingType.Paid
            ? PaidPricingType
            : FreePricingType;
    }

    // Chuyển chuỗi trong database sang enum cho API response.
    public static string PricingTypeToLabel(
        string? pricingType)
    {
        return string.Equals(
            pricingType,
            PaidPricingType,
            StringComparison.OrdinalIgnoreCase)
            ? PaidPricingType
            : FreePricingType;
    }

    // Tài liệu miễn phí không có giá điểm.
    public static decimal NormalizePrice(
        DocumentPricingType pricingType,
        decimal? price)
    {
        if (pricingType != DocumentPricingType.Paid)
        {
            return 0m;
        }

        return price ?? 0m;
    }
}