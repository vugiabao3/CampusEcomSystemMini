namespace CampusEcomSystemMini.Application.Posts.CreatePost;

public record CreatePostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// MODULE_3: toạ độ bài Lost / Found phải hợp lệ.
public enum CreatePostOutcome
{
    Created,

    // Lat vượt [-90, 90], Lng vượt [-180, 180],
    // hoặc chỉ nhập một trong hai toạ độ.
    InvalidCoordinates
}

public record CreatePostResult(
    CreatePostOutcome Outcome,
    CreatePostResponse? Response);