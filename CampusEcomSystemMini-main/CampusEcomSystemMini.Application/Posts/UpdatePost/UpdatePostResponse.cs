namespace CampusEcomSystemMini.Application.Posts.UpdatePost;

public record UpdatePostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// MODULE_3: toạ độ bài Lost / Found phải hợp lệ.
public enum UpdatePostOutcome
{
    Updated,

    // Lat vượt [-90, 90], Lng vượt [-180, 180],
    // hoặc chỉ nhập một trong hai toạ độ.
    InvalidCoordinates
}

public record UpdatePostResult(
    UpdatePostOutcome Outcome,
    UpdatePostResponse? Response);