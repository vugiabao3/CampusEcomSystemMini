using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching.Normalization;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public class UpdatePreferencesHandler
    : IRequestHandler<UpdatePreferencesCommand, UpdatePreferencesResponse?>
{
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdatePreferencesHandler(
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdatePreferencesResponse?> Handle(
        UpdatePreferencesCommand request,
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

        // Study domain — only update fields explicitly provided in the request.
        // Null means "don't change", preventing one vector from wiping the other.
        if (request.StudySubjects is not null)
            preference.StudySubjectsJson = JsonSerializer.Serialize(
                PreferenceResolver.ResolveMulti(request.StudySubjects, AliasMaps.StudySubjects));
        if (request.StudyLanguages is not null)
            preference.StudyLanguagesJson = JsonSerializer.Serialize(
                PreferenceResolver.ResolveMulti(request.StudyLanguages, AliasMaps.StudyLanguages));
        if (request.StudyGoal is not null)
            preference.StudyGoal = PreferenceResolver.ResolveMultiJoin(request.StudyGoal, AliasMaps.StudyGoals);
        if (request.StudyProficiency is not null)
            preference.StudyProficiency = PreferenceResolver.ResolveSingle(request.StudyProficiency, AliasMaps.StudyProficiency);
        if (request.StudyTime is not null)
            preference.StudyTime = PreferenceResolver.ResolveMultiJoin(request.StudyTime, AliasMaps.StudyTime);
        if (request.StudyFormat is not null)
            preference.StudyFormat = PreferenceResolver.ResolveMultiJoin(request.StudyFormat, AliasMaps.StudyFormat);
        if (request.StudyMethod is not null)
            preference.StudyMethod = PreferenceResolver.ResolveMultiJoin(request.StudyMethod, AliasMaps.StudyMethod);
        if (request.StudyFrequency is not null)
            preference.StudyFrequency = PreferenceResolver.ResolveSingle(request.StudyFrequency, AliasMaps.StudyFrequency);

        // Room domain — only update fields explicitly provided in the request.
        if (request.RoomArea is not null)
            preference.RoomArea = PreferenceResolver.ResolveSingle(request.RoomArea, AliasMaps.RoomAreas);

        // Budget: prefer dropdown label mapping, fall back to free-text parser.
        if (request.RoomBudgetRaw is not null)
        {
            BudgetRange? roomBudget = null;
            if (AliasMaps.RoomBudgets.TryGetValue(
                    TextNormalizer.Normalize(request.RoomBudgetRaw) ?? string.Empty,
                    out var budgetRange))
            {
                roomBudget = budgetRange;
            }
            else
            {
                roomBudget = BudgetParser.Parse(request.RoomBudgetRaw);
            }
            preference.RoomBudgetMin = roomBudget?.MinVnd;
            preference.RoomBudgetMax = roomBudget?.MaxVnd;
        }

        if (request.RoomType is not null)
            preference.RoomType = PreferenceResolver.ResolveSingle(request.RoomType, AliasMaps.RoomTypes);
        if (request.RoomSleepSchedule is not null)
            preference.RoomSleepSchedule = PreferenceResolver.ResolveSingle(request.RoomSleepSchedule, AliasMaps.RoomSleepSchedules);
        if (request.RoomCleanliness is not null)
            preference.RoomCleanliness = PreferenceResolver.ResolveSingle(request.RoomCleanliness, AliasMaps.RoomCleanlinessLevels);
        if (request.RoomNoisePreference is not null)
            preference.RoomNoisePreference = PreferenceResolver.ResolveSingle(request.RoomNoisePreference, AliasMaps.RoomNoisePreferences);
        if (request.RoomCookingHabits is not null)
            preference.RoomCookingHabits = PreferenceResolver.ResolveSingle(request.RoomCookingHabits, AliasMaps.RoomCookingHabits);
        if (request.RoomAmenities is not null)
            preference.RoomAmenitiesJson = JsonSerializer.Serialize(
                PreferenceResolver.ResolveMulti(request.RoomAmenities, AliasMaps.RoomAmenities));

        // Legacy / original input — only update if any field in that domain was provided.
        bool studyProvided = request.StudySubjects is not null || request.StudyLanguages is not null ||
            request.StudyGoal is not null || request.StudyProficiency is not null ||
            request.StudyTime is not null || request.StudyFormat is not null ||
            request.StudyMethod is not null || request.StudyFrequency is not null;
        bool roomProvided = request.RoomArea is not null || request.RoomBudgetRaw is not null ||
            request.RoomType is not null || request.RoomSleepSchedule is not null ||
            request.RoomCleanliness is not null || request.RoomNoisePreference is not null ||
            request.RoomCookingHabits is not null || request.RoomAmenities is not null;

        if (studyProvided)
        {
            preference.InterestedSubjects = request.InterestedSubjects;
            preference.StudyOriginalInputJson = JsonSerializer.Serialize(new
            {
                subjects = request.StudySubjects,
                languages = request.StudyLanguages,
                goal = request.StudyGoal,
                proficiency = request.StudyProficiency,
                time = request.StudyTime,
                format = request.StudyFormat,
                method = request.StudyMethod,
                frequency = request.StudyFrequency,
            });
        }
        if (roomProvided)
        {
            preference.Habits = request.Habits;
            preference.Goals = request.Goals;
            preference.PreferredRentalArea = request.PreferredRentalArea;
            preference.MonthlyRentalBudget = request.MonthlyRentalBudget;
            preference.RoomOriginalInputJson = JsonSerializer.Serialize(new
            {
                area = request.RoomArea,
                budgetRaw = request.RoomBudgetRaw,
                type = request.RoomType,
                sleepSchedule = request.RoomSleepSchedule,
                cleanliness = request.RoomCleanliness,
                noisePreference = request.RoomNoisePreference,
                cookingHabits = request.RoomCookingHabits,
                amenities = request.RoomAmenities,
            });
        }

        preference.UpdatedAt = DateTime.UtcNow;

        _preferenceRepository.UpdateAsync(
            preference,
            cancellationToken);

        await _preferenceRepository.SaveChangesAsync(
            cancellationToken);

        return new UpdatePreferencesResponse(
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
