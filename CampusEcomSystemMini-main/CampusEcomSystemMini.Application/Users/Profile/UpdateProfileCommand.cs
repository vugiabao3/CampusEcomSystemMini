using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public record UpdateProfileCommand(
    string FullName,
    string Email,
    string? Phone
) : IRequest<UpdateProfileResponse>;
