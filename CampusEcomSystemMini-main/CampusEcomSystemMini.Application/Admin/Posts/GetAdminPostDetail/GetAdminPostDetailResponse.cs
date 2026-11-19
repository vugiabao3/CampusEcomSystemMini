namespace CampusEcomSystemMini.Application.Admin.Posts;

// Chi tiết một Post cho Admin.
public record GetAdminPostDetailResponse(
    Guid Id,
    Guid UserId,
    string AuthorName,
    string? Type,
    string Title,
    string Content,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);