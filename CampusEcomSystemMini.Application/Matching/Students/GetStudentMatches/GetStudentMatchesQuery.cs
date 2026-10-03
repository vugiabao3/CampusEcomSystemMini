using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.GetStudentMatches;

// GET /api/matching/students
// Current user lấy từ ICurrentUserService, frontend không gửi userId.
public record GetStudentMatchesQuery
    : IRequest<List<GetStudentMatchesResponse>>;