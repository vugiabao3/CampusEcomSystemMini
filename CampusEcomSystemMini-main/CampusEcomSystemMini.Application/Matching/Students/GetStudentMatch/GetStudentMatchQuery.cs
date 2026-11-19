using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatch;

// GET /api/matching/students/{userId}
public record GetStudentMatchQuery(
    Guid UserId
) : IRequest<GetStudentMatchResponse?>;