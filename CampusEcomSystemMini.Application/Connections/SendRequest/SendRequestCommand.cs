using MediatR;

namespace CampusEcomSystemMini.Application.Connections.SendRequest;

// Input chỉ có ReceiverId. Sender lấy từ ICurrentUserService.
public record SendRequestCommand(
    Guid ReceiverId
) : IRequest<SendRequestResult>;
