using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public record GetPreferencesQuery : IRequest<GetPreferencesResponse?>;