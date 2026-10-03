namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;

// Chỉ trả về dữ liệu Smart Matching UI cần,
// không trả về entity hoặc thông tin nhạy cảm.
public record GetStudentMatchesResponse(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    decimal MatchScore
);