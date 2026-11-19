using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Preferences;

// Tạo vector nhu cầu cho người dùng đang đăng nhập.
// Hỗ trợ hai miền độc lập: nhóm học (study) và tìm trọ / ở ghép (room).
public class CreatePreferencesCommand : IRequest<CreatePreferencesResponse?>
{
    // --- Study group (8 tiêu chí) ---
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

    // --- Roommate (8 tiêu chí) ---
    [JsonPropertyName("roomArea")]
    public string? RoomArea { get; set; }

    // Ngân sách thuê trọ: văn bản thô do người dùng nhập (ví dụ "Dưới 2 triệu"),
    // backend sẽ phân tích thành khoảng min/max (VND).
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

    // --- Legacy fields (giữ lại để tương ngược / hiển thị đầu vào ban đầu) ---
    public string? InterestedSubjects { get; set; }

    public string? Habits { get; set; }

    public string? Goals { get; set; }

    public string? PreferredRentalArea { get; set; }

    public decimal? MonthlyRentalBudget { get; set; }
}
