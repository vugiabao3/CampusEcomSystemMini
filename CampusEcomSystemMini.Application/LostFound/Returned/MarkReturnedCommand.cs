using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Returned;

// PUT /api/lost-found/{postId}/returned
// Chỉ chủ bài đăng Found xác nhận đã trả đồ.
public record MarkReturnedCommand(
    Guid PostId
) : IRequest<MarkReturnedResult>;