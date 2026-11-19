namespace CampusEcomSystemMini.Application.Posts.GetMyPosts;

public record GetMyPostsResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);