using MediatR;

namespace CampusEcomSystemMini.Application.Connections.AcceptRequest;

public record AcceptRequestCommand(
    Guid ConnectionRequestId
) : IRequest<AcceptRequestResult>;
