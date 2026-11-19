namespace CampusEcomSystemMini.Application.Admin.Posts;

// Một dòng trong danh sách Post của Admin.
public record GetAdminPostsResponse(
    Guid Id,
    Guid UserId,
    string AuthorName,
    string? Type,
    string Title,
    string Status,
    DateTime CreatedAt
);