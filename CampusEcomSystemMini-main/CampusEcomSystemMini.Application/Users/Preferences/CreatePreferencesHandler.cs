using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Matching.Normalization;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public class CreatePreferencesHandler
    : IRequestHandler<CreatePreferencesCommand, CreatePreferencesResponse?>
{
    private readonly IPreferenceRepository _preferenceRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreatePreferencesHandler(
        IPreferenceRepository preferenceRepository,
        ICurrentUserService currentUserService)
    {
        _preferenceRepository = preferenceRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreatePreferencesResponse?> Handle(
        CreatePreferencesCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var existingPreference =
            await _preferenceRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (existingPreference is not null)
        {
            return null;
        }

        var now = DateTime.UtcNow;

        // Study domain: resolve aliases, store canonical + original.
        var studySubjects = PreferenceResolver.ResolveMulti(
            request.StudySubjects,
            AliasMaps.StudySubjects);
        var studyLanguages = PreferenceResolver.ResolveMulti(
            request.StudyLanguages,
            AliasMaps.StudyLanguages);
        var studyGoal = PreferenceResolver.ResolveMultiJoin(
            request.StudyGoal,
            AliasMaps.StudyGoals);
        var studyProficiency = PreferenceResolver.ResolveSingle(
            request.StudyProficiency,
            AliasMaps.StudyProficiency);
        var studyTime = PreferenceResolver.ResolveMultiJoin(
            request.StudyTime,
            AliasMaps.StudyTime);
        var studyFormat = PreferenceResolver.ResolveMultiJoin(
            request.StudyFormat,
            AliasMaps.StudyFormat);
        var studyMethod = PreferenceResolver.ResolveMultiJoin(
            request.StudyMethod,
            AliasMaps.StudyMethod);
        var studyFrequency = PreferenceResolver.ResolveSingle(
            request.StudyFrequency,
            AliasMaps.StudyFrequency);

        // Room domain.
        var roomArea = PreferenceResolver.ResolveSingle(
            request.RoomArea,
            AliasMaps.RoomAreas);

        // Budget: prefer dropdown label mapping, fall back to free-text parser.
        BudgetRange? roomBudget = null;
        if (request.RoomBudgetRaw is not null &&
            AliasMaps.RoomBudgets.TryGetValue(
                TextNormalizer.Normalize(request.RoomBudgetRaw) ?? string.Empty,
                out var budgetRange))
        {
            roomBudget = budgetRange;
        }
        else
        {
            roomBudget = BudgetParser.Parse(request.RoomBudgetRaw);
        }

        var roomType = PreferenceResolver.ResolveSingle(
            request.RoomType,
            AliasMaps.RoomTypes);
        var roomSleepSchedule = PreferenceResolver.ResolveSingle(
            request.RoomSleepSchedule,
            AliasMaps.RoomSleepSchedules);
        var roomCleanliness = PreferenceResolver.ResolveSingle(
            request.RoomCleanliness,
            AliasMaps.RoomCleanlinessLevels);
        var roomNoisePreference = PreferenceResolver.ResolveSingle(
            request.RoomNoisePreference,
            AliasMaps.RoomNoisePreferences);
        var roomCookingHabits = PreferenceResolver.ResolveSingle(
            request.RoomCookingHabits,
            AliasMaps.RoomCookingHabits);
        var roomAmenities = PreferenceResolver.ResolveMulti(
            request.RoomAmenities,
            AliasMaps.RoomAmenities);

        var preference = new Preference
        {
            Id = Guid.NewGuid(),
            UserId = userId,

            // Study canonical
            StudySubjectsJson = JsonSerializer.Serialize(studySubjects),
            StudyLanguagesJson = JsonSerializer.Serialize(studyLanguages),
            StudyGoal = studyGoal,
            StudyProficiency = studyProficiency,
            StudyTime = studyTime,
            StudyFormat = studyFormat,
            StudyMethod = studyMethod,
            StudyFrequency = studyFrequency,

            // Room canonical
            RoomArea = roomArea,
            RoomBudgetMin = roomBudget?.MinVnd,
            RoomBudgetMax = roomBudget?.MaxVnd,
            RoomType = roomType,
            RoomSleepSchedule = roomSleepSchedule,
            RoomCleanliness = roomCleanliness,
            RoomNoisePreference = roomNoisePreference,
            RoomCookingHabits = roomCookingHabits,
            RoomAmenitiesJson = JsonSerializer.Serialize(roomAmenities),

            // Legacy / original input (for display & backward compat)
            InterestedSubjects = request.InterestedSubjects,
            Habits = request.Habits,
            Goals = request.Goals,
            PreferredRentalArea = request.PreferredRentalArea,
            MonthlyRentalBudget = request.MonthlyRentalBudget,

            // Original input snapshots (JSON)
            StudyOriginalInputJson = JsonSerializer.Serialize(new
            {
                subjects = request.StudySubjects,
                languages = request.StudyLanguages,
                goal = request.StudyGoal,
                proficiency = request.StudyProficiency,
                time = request.StudyTime,
                format = request.StudyFormat,
                method = request.StudyMethod,
                frequency = request.StudyFrequency,
            }),
            RoomOriginalInputJson = JsonSerializer.Serialize(new
            {
                area = request.RoomArea,
                budgetRaw = request.RoomBudgetRaw,
                type = request.RoomType,
                sleepSchedule = request.RoomSleepSchedule,
                cleanliness = request.RoomCleanliness,
                noisePreference = request.RoomNoisePreference,
                cookingHabits = request.RoomCookingHabits,
                amenities = request.RoomAmenities,
            }),

            CreatedAt = now,
            UpdatedAt = now
        };

        await _preferenceRepository.AddAsync(
            preference,
            cancellationToken);

        await _preferenceRepository.SaveChangesAsync(
            cancellationToken);

        return new CreatePreferencesResponse(
            preference.Id,
            preference.UserId,
            studySubjects,
            studyLanguages,
            studyGoal,
            studyProficiency,
            studyTime,
            studyFormat,
            studyMethod,
            studyFrequency,
            roomArea,
            roomBudget?.MinVnd,
            roomBudget?.MaxVnd,
            roomType,
            roomSleepSchedule,
            roomCleanliness,
            roomNoisePreference,
            roomCookingHabits,
            roomAmenities,
            request.InterestedSubjects,
            request.Habits,
            request.Goals,
            request.PreferredRentalArea,
            request.MonthlyRentalBudget,
            preference.CreatedAt,
            preference.UpdatedAt);
    }
}
