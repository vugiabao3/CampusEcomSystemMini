namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatches;

// Chỉ trả về dữ liệu Room Matching UI cần: thông tin ứng viên
// tìm trọ / ở ghép và các trường nhu cầu thuê trọ đã dùng để
// tính MatchScore. Không trả về entity hay thông tin nhạy cảm.
public record GetRoomMatchesResponse(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    decimal MatchScore,
    string? PreferredRentalArea,
    decimal? MonthlyRentalBudget,
    string? RoomPostTitle
);