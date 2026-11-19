using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Nearby;

public record GetLostFoundNearbyQuery(
    double Lat,
    double Lng,
    string? Type = null,
    double RadiusMeters = 500) : IRequest<GetLostFoundNearbyResponse>;