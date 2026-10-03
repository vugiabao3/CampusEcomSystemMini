namespace CampusEcomSystemMini.Application.Library.Documents;

// Kết quả của một giao dịch điểm.
//
// BuyerBalance là số dư còn lại sau giao dịch nếu
// hệ thống điểm đã được triển khai,
// dùng để báo lại cho frontend sau khi tải tài liệu trả phí.
public sealed record PointServiceResult(
    PointServiceStatus Status,
    int? BuyerBalance,
    string? Message)
{
    public static PointServiceResult Completed(
        int? buyerBalance)
    {
        return new PointServiceResult(
            PointServiceStatus.Completed,
            buyerBalance,
            null);
    }

    public static PointServiceResult InsufficientBalance(
        string message)
    {
        return new PointServiceResult(
            PointServiceStatus.InsufficientBalance,
            null,
            message);
    }

    public static PointServiceResult Unavailable(
        string message)
    {
        return new PointServiceResult(
            PointServiceStatus.Unavailable,
            null,
            message);
    }

    public static PointServiceResult Failed(
        string message)
    {
        return new PointServiceResult(
            PointServiceStatus.Failed,
            null,
            message);
    }
}
