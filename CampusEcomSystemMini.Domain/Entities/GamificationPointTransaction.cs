namespace CampusEcomSystemMini.Domain.Entities;

// Một lần cộng / trừ điểm uy tín của người dùng (MODULE_6).
// Balance lưu số điểm còn lại ngay sau giao dịch,
// nên lịch sử điểm tự giải thích và không cần tính lại.
public class GamificationPointTransaction
{
    public Guid Id { get; set; }

    // Người dùng nhận điểm, lấy từ ICurrentUserService
    // ở use case cập nhật điểm.
    public Guid UserId { get; set; }

    // Số điểm cộng (dương) hoặc trừ (âm).
    public int Change { get; set; }

    // Mô tả lý do cộng / trừ điểm,
    // ví dụ "LostFound Returned", "Book Exchange".
    public string Reason { get; set; } = string.Empty;

    // Tổng điểm còn lại sau giao dịch này.
    public int Balance { get; set; }

    public DateTime CreatedAt { get; set; }
}
