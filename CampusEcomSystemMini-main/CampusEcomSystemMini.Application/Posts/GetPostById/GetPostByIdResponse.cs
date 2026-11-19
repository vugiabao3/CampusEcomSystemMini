namespace CampusEcomSystemMini.Application.Posts.GetPostById;

public record GetPostByIdResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);