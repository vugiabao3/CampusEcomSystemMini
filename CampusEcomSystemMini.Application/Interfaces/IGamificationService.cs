namespace CampusEcomSystemMini.Application.Interfaces;

// Gamification của Module 6.
// Mọi thay đổi điểm phải đi qua service này, không sửa
// ReputationPoints trực tiếp trong Controller hay Handler khác.
public interface IGamificationService
{
    // Cộng / trừ điểm theo lý do trong GamificationPointRules,
    // ghi thêm một dòng lịch sử điểm và trả về số dư mới.
    // Trả về số dư hiện tại nếu lý do không có trong bảng điểm.
    Task<int> ApplyRuleAsync(
        Guid userId,
        string reason,
        CancellationToken cancellationToken);
}