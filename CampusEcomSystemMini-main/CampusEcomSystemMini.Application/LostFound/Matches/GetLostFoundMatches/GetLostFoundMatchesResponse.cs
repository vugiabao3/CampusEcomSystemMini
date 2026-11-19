namespace CampusEcomSystemMini.Application.LostFound.Matches;

public record GetLostFoundMatchItem(
    Guid PostId,
    string Type,
    string Title,
    string? Location,
    double Lat,
    double Lng,
    string Status,
    double DistanceMeters,
    DateTime CreatedAt);

public record GetLostFoundMatchesResponse(
    Guid SourcePostId,
    string SourceType,
    IReadOnlyList<GetLostFoundMatchItem> Matches);