namespace CampusEcomSystemMini.Domain.Entities;

// Câu hỏi bí mật dùng xác minh quyền sở hữu đồ vật
// cho một bài đăng Found (MODULE_3).
// Chỉ người nhặt được đồ (chủ bài đăng Found) được tạo.
// SecretAnswerHash là hash một chiều của câu trả lời,
// tuyệt đối không trả về qua API.
public class SecretQuestion
{
    public Guid Id { get; set; }

    // Bài đăng Found đi kèm.
    public Guid PostId { get; set; }

    public string Question { get; set; } = string.Empty;

    // Hash của câu trả lời bí mật, không lưu bản rõ.
    public string SecretAnswerHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}