namespace CampusEcomSystemMini.Application.LostFound.UpdateLostFoundPost;

public record UpdateLostFoundPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum UpdateLostFoundPostOutcome
{
    Updated,
    InvalidCoordinates,
    NotFoundOrNotOwner
}

public record UpdateLostFoundPostResult(
    UpdateLostFoundPostOutcome Outcome,
    UpdateLostFoundPostResponse? Response
);
