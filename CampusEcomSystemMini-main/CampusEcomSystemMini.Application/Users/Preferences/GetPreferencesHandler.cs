using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public class GetPreferencesHandler
    : IRequestHandler<GetPreferencesQuery, GetPreferencesResponse?>
{
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetPreferencesHandler(
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetPreferencesResponse?> Handle(
        GetPreferencesQuery request,
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

        return new GetPreferencesResponse(
            preference.Id,
            preference.UserId,
            DeserializeStringList(preference.StudySubjectsJson),
            DeserializeStringList(preference.StudyLanguagesJson),
            preference.StudyGoal,
            preference.StudyProficiency,
            preference.StudyTime,
            preference.StudyFormat,
            preference.StudyMethod,
            preference.StudyFrequency,
            preference.RoomArea,
            preference.RoomBudgetMin,
            preference.RoomBudgetMax,
            preference.RoomType,
            preference.RoomSleepSchedule,
            preference.RoomCleanliness,
            preference.RoomNoisePreference,
            preference.RoomCookingHabits,
            DeserializeStringList(preference.RoomAmenitiesJson),
            preference.InterestedSubjects,
            preference.Habits,
            preference.Goals,
            preference.PreferredRentalArea,
            preference.MonthlyRentalBudget,
            preference.CreatedAt,
            preference.UpdatedAt);
    }

    private static List<string>? DeserializeStringList(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return null;
        }

        try
        {
            var list = JsonSerializer.Deserialize<List<string>>(json);

            return list;
        }
        catch
        {
            return null;
        }
    }
}
