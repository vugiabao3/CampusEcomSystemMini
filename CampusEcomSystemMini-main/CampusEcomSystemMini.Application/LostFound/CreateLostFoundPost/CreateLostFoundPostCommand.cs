using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.CreateLostFoundPost;

public record CreateLostFoundPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<CreateLostFoundPostResult>;
