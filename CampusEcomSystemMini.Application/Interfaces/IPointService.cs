using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Application.Interfaces;

// Trừ điểm người mua và cộng điểm người đăng khi tải tài liệu trả phí.
//
// MODULE 4 chỉ cần abstraction này để thực hiện
// kiểm tra số dư / transaction / rollback,
// phần ledger và số dư thuộc Module 6.
public interface IPointService
{
    // Kiểm tra số dư và trừ điểm trong một giao dịch.
    // Trả về InsufficientBalance nếu người mua không đủ điểm.
    Task<PointServiceResult> TryPurchaseAsync(
        PointPurchase purchase,
        CancellationToken cancellationToken);

    // Hoàn lại giao dịch đã trừ điểm khi watermark hoặc
    // bước quan trọng sau đó thất bại (rollback của MODULE 4).
    Task RefundAsync(
        PointPurchase purchase,
        CancellationToken cancellationToken);
}
