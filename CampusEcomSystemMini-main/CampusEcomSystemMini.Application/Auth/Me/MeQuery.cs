using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Me;

public record MeQuery : IRequest<MeResponse>;