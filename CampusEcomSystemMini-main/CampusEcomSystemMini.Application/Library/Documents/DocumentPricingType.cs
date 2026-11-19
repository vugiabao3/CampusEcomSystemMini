namespace CampusEcomSystemMini.Application.Library.Documents;

// PricingType do frontend gửi lên.
// Tài liệu miễn phí không trừ điểm khi download,
// tài liệu trả phí kiểm tra số dư điểm ở batch Download.
public enum DocumentPricingType
{
    Free,
    Paid
}