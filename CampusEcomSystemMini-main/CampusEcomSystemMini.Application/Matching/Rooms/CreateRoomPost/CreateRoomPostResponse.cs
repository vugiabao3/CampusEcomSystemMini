namespace CampusEcomSystemMini.Application.Matching.Rooms.CreateRoomPost;

public record CreateRoomPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum CreateRoomPostOutcome
{
    Created,
    InvalidCoordinates
}

public record CreateRoomPostResult(
    CreateRoomPostOutcome Outcome,
    CreateRoomPostResponse? Response
);
