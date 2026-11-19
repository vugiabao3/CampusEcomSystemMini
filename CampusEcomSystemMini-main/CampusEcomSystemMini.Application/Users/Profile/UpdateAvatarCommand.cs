using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public record UpdateAvatarCommand(
    string AvatarUrl
) : IRequest<UpdateAvatarResponse>;
