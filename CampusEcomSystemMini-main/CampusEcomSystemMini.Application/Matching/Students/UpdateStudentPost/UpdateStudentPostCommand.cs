using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.UpdateStudentPost;

public record UpdateStudentPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<UpdateStudentPostResult>
{
    public Guid Id { get; init; }
}
