using System.Text.Json;
using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Normalization;
using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Matching;

// Converts a persisted Preference entity into domain-specific structured
// preference models used by the matching services.
public static class PreferenceModelConverter
{
    public static StudyPreferences? ToStudyPreferences(Preference? preference)
    {
        if (preference is null)
        {
            return null;
        }

        return new StudyPreferences(
            DeserializeList(preference.StudySubjectsJson),
            DeserializeList(preference.StudyLanguagesJson),
            preference.StudyGoal,
            preference.StudyProficiency,
            preference.StudyTime,
            preference.StudyFormat,
            preference.StudyMethod,
            preference.StudyFrequency);
    }

    public static RoomPreferences? ToRoomPreferences(Preference? preference)
    {
        if (preference is null)
        {
            return null;
        }

        return new RoomPreferences(
            preference.RoomArea,
            preference.RoomBudgetMin.HasValue || preference.RoomBudgetMax.HasValue
                ? new BudgetRange(preference.RoomBudgetMin, preference.RoomBudgetMax)
                : null,
            preference.RoomType,
            preference.RoomSleepSchedule,
            preference.RoomCleanliness,
            preference.RoomNoisePreference,
            preference.RoomCookingHabits,
            DeserializeList(preference.RoomAmenitiesJson));
    }

    private static List<string> DeserializeList(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        try
        {
            var list = JsonSerializer.Deserialize<List<string>>(json);

            return list ?? [];
        }
        catch
        {
            return [];
        }
    }
}
