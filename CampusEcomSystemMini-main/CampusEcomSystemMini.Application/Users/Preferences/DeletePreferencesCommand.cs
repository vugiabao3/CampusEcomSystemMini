using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public record DeletePreferencesCommand
    : IRequest<DeletePreferencesResponse?>;