namespace CampusEcomSystemMini.Domain.Entities;

// Vector nhu cầu / sở thích của người dùng.
// Module 2 sẽ đọc dữ liệu này cho Smart Matching.
//
// Hai miền độc lập được lưu riêng để tránh lẫn:
//   - Study*: vector nhu cầu nhóm học (8 tiêu chí).
//   - Room*: vector nhu cầu phòng trọ / ở ghép (8 tiêu chí).
//
// Các trường không đuôi "Json" là giá trị chuẩn (canonical) dùng cho
// tính toán matching. Các trường ...OriginalInputJson lưu giữ đầu vào
// gốc của người dùng để hiển thị / debug. Các trường cũ
// (InterestedSubjects, Habits, Goals, PreferredRentalArea,
// MonthlyRentalBudget) giữ nguyên để tương ngược và hiển thị đầu vào ban
// đầu.
public class Preference
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    // --- Study group preferences (canonical, for matching) ---
    public string? StudySubjectsJson { get; set; }

    public string? StudyLanguagesJson { get; set; }

    public string? StudyGoal { get; set; }

    public string? StudyProficiency { get; set; }

    public string? StudyTime { get; set; }

    public string? StudyFormat { get; set; }

    public string? StudyMethod { get; set; }

    public string? StudyFrequency { get; set; }

    // --- Roommate preferences (canonical, for matching) ---
    public string? RoomArea { get; set; }

    public decimal? RoomBudgetMin { get; set; }

    public decimal? RoomBudgetMax { get; set; }

    public string? RoomType { get; set; }

    public string? RoomSleepSchedule { get; set; }

    public string? RoomCleanliness { get; set; }

    public string? RoomNoisePreference { get; set; }

    public string? RoomCookingHabits { get; set; }

    public string? RoomAmenitiesJson { get; set; }

    // --- Original input (for display / debugging) ---
    public string? InterestedSubjects { get; set; }

    public string? Habits { get; set; }

    public string? Goals { get; set; }

    public string? PreferredRentalArea { get; set; }

    public decimal? MonthlyRentalBudget { get; set; }

    public string? StudyOriginalInputJson { get; set; }

    public string? RoomOriginalInputJson { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}