using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.UpdateRoomPost;

public record UpdateRoomPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<UpdateRoomPostResult>
{
    public Guid Id { get; init; }
}
