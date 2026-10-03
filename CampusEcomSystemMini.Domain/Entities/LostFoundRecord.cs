namespace CampusEcomSystemMini.Domain.Entities;

// Thông tin Lost & Found mở rộng cho một bài đăng Post có
// Type = Lost hoặc Found (MODULE_3).
// Nội dung, tiêu đề và chủ sở hữu vẫn thuộc Post của MODULE_1,
// entity này chỉ giữ phần dữ liệu Post chưa có:
// trạng thái trao trả và tọa độ hiển thị trên Campus Map.
public class LostFoundRecord
{
    public Guid Id { get; set; }

    // Bài đăng Lost / Found đi kèm.
    public Guid PostId { get; set; }

    // Lost / Found / Returned theo workflow Lost & Found.
    // Khi chưa có bản ghi thì trạng thái lấy theo Post.Type.
    public string? Status { get; set; }

    // Vị trí campus / tòa nhà nơi đồ thất lạc được báo.
    public string? Location { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}