using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.DeleteRoomPost;

public record DeleteRoomPostCommand(Guid Id) : IRequest<DeleteRoomPostResponse?>;
