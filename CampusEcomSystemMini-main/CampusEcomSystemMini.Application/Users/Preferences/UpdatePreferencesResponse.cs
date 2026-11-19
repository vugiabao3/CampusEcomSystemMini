using System.Text.Json.Serialization;

namespace CampusEcomSystemMini.Application.Users.Preferences;

public record UpdatePreferencesResponse(
    Guid Id,
    Guid UserId,

    [property: JsonPropertyName("studySubjects")]
    List<string>? StudySubjects,

    [property: JsonPropertyName("studyLanguages")]
    List<string>? StudyLanguages,

    [property: JsonPropertyName("studyGoal")]
    string? StudyGoal,

    [property: JsonPropertyName("studyProficiency")]
    string? StudyProficiency,

    [property: JsonPropertyName("studyTime")]
    string? StudyTime,

    [property: JsonPropertyName("studyFormat")]
    string? StudyFormat,

    [property: JsonPropertyName("studyMethod")]
    string? StudyMethod,

    [property: JsonPropertyName("studyFrequency")]
    string? StudyFrequency,

    [property: JsonPropertyName("roomArea")]
    string? RoomArea,

    [property: JsonPropertyName("roomBudgetMin")]
    decimal? RoomBudgetMin,

    [property: JsonPropertyName("roomBudgetMax")]
    decimal? RoomBudgetMax,

    [property: JsonPropertyName("roomType")]
    string? RoomType,

    [property: JsonPropertyName("roomSleepSchedule")]
    string? RoomSleepSchedule,

    [property: JsonPropertyName("roomCleanliness")]
    string? RoomCleanliness,

    [property: JsonPropertyName("roomNoisePreference")]
    string? RoomNoisePreference,

    [property: JsonPropertyName("roomCookingHabits")]
    string? RoomCookingHabits,

    [property: JsonPropertyName("roomAmenities")]
    List<string>? RoomAmenities,

    [property: JsonPropertyName("interestedSubjects")]
    string? InterestedSubjects,

    [property: JsonPropertyName("habits")]
    string? Habits,

    [property: JsonPropertyName("goals")]
    string? Goals,

    [property: JsonPropertyName("preferredRentalArea")]
    string? PreferredRentalArea,

    [property: JsonPropertyName("monthlyRentalBudget")]
    decimal? MonthlyRentalBudget,

    DateTime CreatedAt,
    DateTime UpdatedAt
);
