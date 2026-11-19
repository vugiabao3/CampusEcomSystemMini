using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.CreateRoomPost;

public record CreateRoomPostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<CreateRoomPostResult>;
