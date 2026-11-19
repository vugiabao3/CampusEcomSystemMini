using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Register;

public record RegisterCommand(
    string FullName,
    string Email,
    string Password
) : IRequest<RegisterResponse>;