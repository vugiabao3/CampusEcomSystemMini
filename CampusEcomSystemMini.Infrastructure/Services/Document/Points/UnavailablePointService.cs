using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Infrastructure.Services.Document.Points;

// Hệ thống điểm thuộc MODULE 6, hiện chưa có bảng / ledger trong database.
//
// MODULE 4 chỉ yêu cầu abstraction để kiểm tra số dư và thực hiện
// giao dịch khi tải tài liệu trả phí, nên batch này không tự tạo
// Module 6 mà trả về Unavailable.
//
// Hệ quả: tải tài liệu miễn phí hoạt động bình thường,
// còn tài liệu trả phí bị từ chối cho tới khi Module 6 có số dư.
// Cách này an toàn hơn là trả file trả phí cho miễn phí.
//
// Khi Module 6 được triển khai chỉ cần thay lớp này,
// Application không phải sửa.
public class UnavailablePointService : IPointService
{
    private const string UnavailableMessage =
        "Hệ thống điểm chưa được triển khai, " +
        "hiện chưa thể tải tài liệu trả phí.";

    public Task<PointServiceResult> TryPurchaseAsync(
        PointPurchase purchase,
        CancellationToken cancellationToken)
    {
        return Task.FromResult(
            PointServiceResult.Unavailable(UnavailableMessage));
    }

    public Task RefundAsync(
        PointPurchase purchase,
        CancellationToken cancellationToken)
    {
        // Chưa có giao dịch nào được thực hiện nên không có gì để hoàn lại.
        return Task.CompletedTask;
    }
}
