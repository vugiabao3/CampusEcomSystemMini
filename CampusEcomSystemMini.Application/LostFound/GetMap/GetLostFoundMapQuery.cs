using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetMap;

// GET /api/lost-found/map
// Dữ liệu pin cho Campus Map: toạ độ do Backend cung cấp,
// Frontend chỉ hiển thị.
public record GetLostFoundMapQuery
    : IRequest<List<GetLostFoundMapResponse>>;