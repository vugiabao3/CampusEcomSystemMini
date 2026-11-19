using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Login;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<LoginResponse>;