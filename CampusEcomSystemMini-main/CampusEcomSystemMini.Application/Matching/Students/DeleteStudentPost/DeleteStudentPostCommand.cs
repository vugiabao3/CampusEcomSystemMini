using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.DeleteStudentPost;

public record DeleteStudentPostCommand(Guid Id) : IRequest<DeleteStudentPostResponse?>;
