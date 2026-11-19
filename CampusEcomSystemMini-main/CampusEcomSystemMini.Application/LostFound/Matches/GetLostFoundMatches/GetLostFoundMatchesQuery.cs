using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Matches;

public record GetLostFoundMatchesQuery(
    Guid PostId) : IRequest<GetLostFoundMatchesResponse>;