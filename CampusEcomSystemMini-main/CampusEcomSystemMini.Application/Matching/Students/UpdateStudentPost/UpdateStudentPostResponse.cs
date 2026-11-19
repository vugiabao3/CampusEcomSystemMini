namespace CampusEcomSystemMini.Application.Matching.Students.UpdateStudentPost;

public record UpdateStudentPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum UpdateStudentPostOutcome
{
    Updated,
    InvalidCoordinates,
    NotFoundOrNotOwner
}

public record UpdateStudentPostResult(
    UpdateStudentPostOutcome Outcome,
    UpdateStudentPostResponse? Response
);
