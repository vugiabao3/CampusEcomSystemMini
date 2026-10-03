namespace CampusEcomSystemMini.Domain.Entities;

// Yêu cầu nhận lại đồ của người bị mất đồ gửi cho một bài
// đăng Found (MODULE_3).
// Người tạo phải trả lời đúng SecretQuestion của bài đăng.
// Trạng thái hiện chỉ có Pending, Approve / Reject thuộc
// batch sau.
public class Claim
{
    public Guid Id { get; set; }

    // Bài đăng Found đi kèm.
    public Guid PostId { get; set; }

    // Người gửi yêu cầu nhận đồ, lấy từ ICurrentUserService.
    public Guid ClaimantUserId { get; set; }

    // Pending / Approved / Rejected.
    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}