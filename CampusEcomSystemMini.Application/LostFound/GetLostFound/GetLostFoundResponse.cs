namespace CampusEcomSystemMini.Application.LostFound.GetLostFound;

// Chỉ trả về dữ liệu Lost & Found UI cần.
// Nội dung, tiêu đề và chủ bài đăng lấy từ Post của Module 1,
// tọa độ / vị trí / trạng thái lấy từ bản ghi Lost & Found.
// Không trả về entity hay thông tin nhạy cảm.
public record GetLostFoundResponse(
    Guid PostId,
    Guid UserId,
    string FullName,
    string? Type,
    string Title,
    string Description,
    string? Location,
    double? Lat,
    double? Lng,
    string? Status,
    DateTime CreatedAt
);