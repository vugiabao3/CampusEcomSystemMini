namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatch;

public record GetStudentMatchResponse(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    decimal MatchScore
);