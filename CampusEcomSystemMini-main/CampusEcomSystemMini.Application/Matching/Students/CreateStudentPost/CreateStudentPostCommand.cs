using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.CreateStudentPost;

public record CreateStudentPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<CreateStudentPostResult>;
