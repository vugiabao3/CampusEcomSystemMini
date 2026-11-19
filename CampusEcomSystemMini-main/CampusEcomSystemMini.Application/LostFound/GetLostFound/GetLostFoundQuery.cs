using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetLostFound;

// GET /api/lost-found?type=Lost | Found | status=Returned
// Không truyền tham số nào nghĩa là lấy tất cả đồ thất lạc
// (các bài đăng Post.Type = Lost hoặc Found).
public record GetLostFoundQuery(
    string? Type,
    string? Status
) : IRequest<List<GetLostFoundResponse>>;