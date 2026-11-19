namespace CampusEcomSystemMini.Domain.Entities;

// Cuộc trò chuyện 1-1 giữa hai sinh viên (MODULE_5 / BATCH 2).
// Cuộc trò chuyện được tạo khi hai bên đồng ý kết nối.
// Chat hiện tại chỉ 1-1, không group chat.
public class Conversation
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }
}
