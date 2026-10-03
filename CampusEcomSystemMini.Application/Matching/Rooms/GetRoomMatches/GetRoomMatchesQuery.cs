using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatches;

// GET /api/matching/rooms
// Current user lấy từ ICurrentUserService, frontend không gửi userId.
public record GetRoomMatchesQuery
    : IRequest<List<GetRoomMatchesResponse>>;