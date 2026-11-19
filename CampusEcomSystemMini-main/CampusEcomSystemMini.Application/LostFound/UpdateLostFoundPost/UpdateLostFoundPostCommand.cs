using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.UpdateLostFoundPost;

public record UpdateLostFoundPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<UpdateLostFoundPostResult>
{
    public Guid Id { get; init; }
}
