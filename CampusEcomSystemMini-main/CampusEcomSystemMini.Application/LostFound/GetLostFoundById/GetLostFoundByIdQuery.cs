using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetLostFoundById;

public record GetLostFoundByIdQuery(Guid PostId) : IRequest<GetLostFoundByIdResponse?>;

public record GetLostFoundByIdResponse(
    Guid PostId,
    Guid UserId,
    string FullName,
    string Type,
    string Title,
    string Content,
    string? Location,
    double? Lat,
    double? Lng,
    string Status,
    DateTime CreatedAt);