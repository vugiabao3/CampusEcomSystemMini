using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public record GetProfileQuery : IRequest<GetProfileResponse>;
