using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

// Cập nhật vector nhu cầu đã tồn tại. Cùng hình thức với CreatePreferencesCommand.
public class UpdatePreferencesCommand : IRequest<UpdatePreferencesResponse?>
{
    [JsonPropertyName("studySubjects")]
    public List<string>? StudySubjects { get; set; }

    [JsonPropertyName("studyLanguages")]
    public List<string>? StudyLanguages { get; set; }

    [JsonPropertyName("studyGoal")]
    public string? StudyGoal { get; set; }

    [JsonPropertyName("studyProficiency")]
    public string? StudyProficiency { get; set; }

    [JsonPropertyName("studyTime")]
    public string? StudyTime { get; set; }

    [JsonPropertyName("studyFormat")]
    public string? StudyFormat { get; set; }

    [JsonPropertyName("studyMethod")]
    public string? StudyMethod { get; set; }

    [JsonPropertyName("studyFrequency")]
    public string? StudyFrequency { get; set; }

    [JsonPropertyName("roomArea")]
    public string? RoomArea { get; set; }

    [JsonPropertyName("roomBudgetRaw")]
    public string? RoomBudgetRaw { get; set; }

    [JsonPropertyName("roomType")]
    public string? RoomType { get; set; }

    [JsonPropertyName("roomSleepSchedule")]
    public string? RoomSleepSchedule { get; set; }

    [JsonPropertyName("roomCleanliness")]
    public string? RoomCleanliness { get; set; }

    [JsonPropertyName("roomNoisePreference")]
    public string? RoomNoisePreference { get; set; }

    [JsonPropertyName("roomCookingHabits")]
    public string? RoomCookingHabits { get; set; }

    [JsonPropertyName("roomAmenities")]
    public List<string>? RoomAmenities { get; set; }

    public string? InterestedSubjects { get; set; }

    public string? Habits { get; set; }

    public string? Goals { get; set; }

    public string? PreferredRentalArea { get; set; }

    public decimal? MonthlyRentalBudget { get; set; }
}
