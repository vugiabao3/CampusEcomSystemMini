namespace CampusEcomSystemMini.Application.Library.Documents;

// Giao dịch điểm khi tải một tài liệu trả phí.
//
// MODULE 4 chỉ yêu cầu abstraction, hệ thống điểm
// thuộc Module 6 nên chưa có bảng / ledger trong database.
public sealed record PointPurchase(
    Guid BuyerId,
    Guid SellerId,
    int Amount,
    string Reason);
