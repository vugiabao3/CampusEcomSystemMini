using MediatR;

namespace CampusEcomSystemMini.Application.Connections.RejectRequest;

public record RejectRequestCommand(
    Guid ConnectionRequestId
) : IRequest<RejectRequestResult>;
