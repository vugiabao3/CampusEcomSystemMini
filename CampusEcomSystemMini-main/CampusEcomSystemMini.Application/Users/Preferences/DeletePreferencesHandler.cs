using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public class DeletePreferencesHandler
    : IRequestHandler<DeletePreferencesCommand, DeletePreferencesResponse?>
{
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeletePreferencesHandler(
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeletePreferencesResponse?> Handle(
        DeletePreferencesCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var preference =
            await _preferenceRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (preference is null)
        {
            return null;
        }

        _preferenceRepository.Remove(preference);

        await _preferenceRepository.SaveChangesAsync(
            cancellationToken);

        return new DeletePreferencesResponse(
            true,
            "Preferences deleted successfully.");
    }
}