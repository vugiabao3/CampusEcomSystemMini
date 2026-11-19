namespace CampusEcomSystemMini.Application.LostFound.CreateLostFoundPost;

public record CreateLostFoundPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum CreateLostFoundPostOutcome
{
    Created,
    InvalidCoordinates
}

public record CreateLostFoundPostResult(
    CreateLostFoundPostOutcome Outcome,
    CreateLostFoundPostResponse? Response
);
