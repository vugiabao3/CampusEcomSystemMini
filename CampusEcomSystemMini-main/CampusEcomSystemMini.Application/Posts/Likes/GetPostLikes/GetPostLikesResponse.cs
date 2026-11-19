namespace CampusEcomSystemMini.Application.Posts.Likes.GetPostLikes;

public record GetPostLikesResponse(
    Guid Id,
    Guid PostId,
    Guid UserId,
    DateTime CreatedAt
);