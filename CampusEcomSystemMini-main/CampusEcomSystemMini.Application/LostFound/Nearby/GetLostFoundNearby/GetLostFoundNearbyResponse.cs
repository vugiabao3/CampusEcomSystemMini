namespace CampusEcomSystemMini.Application.LostFound.Nearby;

public record GetLostFoundNearbyItem(
    Guid PostId,
    string Type,
    string Title,
    string? Location,
    double Lat,
    double Lng,
    string Status,
    double DistanceMeters,
    DateTime CreatedAt);

public record GetLostFoundNearbyResponse(
    double CenterLat,
    double CenterLng,
    double RadiusMeters,
    IReadOnlyList<GetLostFoundNearbyItem> Items);