namespace CampusEcomSystemMini.Application.Posts.Likes.LikePost;

public record LikePostResponse(
    Guid Id,
    Guid PostId,
    Guid UserId,
    DateTime CreatedAt
);