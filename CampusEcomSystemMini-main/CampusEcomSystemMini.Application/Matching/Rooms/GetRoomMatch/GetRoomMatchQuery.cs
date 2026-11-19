using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatch;

// GET /api/matching/rooms/{userId}
public record GetRoomMatchQuery(
    Guid UserId
) : IRequest<GetRoomMatchResponse?>;