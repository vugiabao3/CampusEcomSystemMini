using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword
) : IRequest<ChangePasswordResponse>;
