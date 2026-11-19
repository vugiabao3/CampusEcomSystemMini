namespace CampusEcomSystemMini.Application.LostFound.GetMap;

// Chỉ trả về dữ liệu Campus Map cần: bài đăng, vị trí và toạ độ.
public record GetLostFoundMapResponse(
    Guid PostId,
    string Title,
    string? Type,
    string? Location,
    double Lat,
    double Lng,
    string? Status
);