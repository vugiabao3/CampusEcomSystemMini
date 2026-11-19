namespace CampusEcomSystemMini.Application.Matching.Students.CreateStudentPost;

public record CreateStudentPostResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Content,
    string? Type,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public enum CreateStudentPostOutcome
{
    Created,
    InvalidCoordinates
}

public record CreateStudentPostResult(
    CreateStudentPostOutcome Outcome,
    CreateStudentPostResponse? Response
);
