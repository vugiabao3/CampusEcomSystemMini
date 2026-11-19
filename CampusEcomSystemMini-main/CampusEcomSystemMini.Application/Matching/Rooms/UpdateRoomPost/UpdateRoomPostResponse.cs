namespace CampusEcomSystemMini.Application.Matching.Rooms.UpdateRoomPost;

public record UpdateRoomPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum UpdateRoomPostOutcome
{
    Updated,
    InvalidCoordinates,
    NotFoundOrNotOwner
}

public record UpdateRoomPostResult(
    UpdateRoomPostOutcome Outcome,
    UpdateRoomPostResponse? Response
);
