namespace CampusEcomSystemMini.Application.Matching.Encoding;

using CampusEcomSystemMini.Application.Matching.Normalization;

// Structured roommate-preference input (canonical values, already
// normalized and alias-resolved by callers). Budget is a parsed range.
public record RoomPreferences(
    string? Area,
    BudgetRange? Budget,
    string? RoomType,
    string? SleepSchedule,
    string? Cleanliness,
    string? NoisePreference,
    string? CookingHabits,
    IReadOnlyList<string> Amenities);

public record RoomFeatureResult(
    double[] Features,        // non-budget criteria only
    double Coverage,          // fraction of all 8 criteria filled [0,1]
    int FilledCriteria,
    int TotalCriteria = 8,
    BudgetRange? Budget = null);

// Encodes roommate preferences into a fixed-length numerical feature
// vector for cosine similarity. Budget is deliberately EXCLUDED from the
// vector: range overlap is not a cosine-friendly scalar, so it is handled
// separately by BudgetParser.Compatibility in the matching service.
//
// Encoding:
//   - Area, RoomType, SleepSchedule, NoisePreference, CookingHabits:
//     one-hot categorical (one dimension per canonical value).
//   - Cleanliness: ordinal scaled to [0,1].
//   - Amenities: multi-hot (one dimension per canonical amenity).
//   - Budget: excluded from vector; coverage still counts it if filled.
//
// Missing criteria -> 0 in vector, reduce coverage.
public interface IRoomFeatureEncoder
{
    IReadOnlyList<string> FeatureNames { get; }

    RoomFeatureResult Encode(RoomPreferences? preferences);
}

public class RoomFeatureEncoder : IRoomFeatureEncoder
{
    // Fixed canonical vocabularies. Order is stable -> stable schema.
    // Must match AliasMaps canonical values exactly so encoded dimensions
    // line up with values stored in the database.
    private static readonly IReadOnlyList<string> Areas =
    [
        "Ba Đình",
        "Hoàn Kiếm",
        "Tây Hồ",
        "Long Biên",
        "Cầu Giấy",
        "Đống Đa",
        "Hai Bà Trưng",
        "Hoàng Mai",
        "Thanh Xuân",
        "Nam Từ Liêm",
        "Bắc Từ Liêm",
        "Hà Đông"
    ];

    private static readonly IReadOnlyList<string> RoomTypes =
    [
        "Phòng trọ khép kín",
        "Phòng trọ không khép kín",
        "Chung cư mini / Căn hộ dịch vụ",
        "Chung cư nguyên căn",
        "Ở ghép (Homestay / Dorm)",
        "Nhà nguyên căn / Tập thể"
    ];

    private static readonly IReadOnlyList<string> SleepSchedules =
    [
        "Ngủ sớm (trước 23h)",
        "Ngủ muộn (sau 24h)",
        "Linh hoạt / Tùy hôm",
        "Làm ca đêm / Xoay ca"
    ];

    private static readonly IReadOnlyList<string> CleanlinessLevels =
    [
        "Rất sạch sẽ, ngăn nắp",
        "Khá sạch sẽ",
        "Bình thường / Thoải mái",
        "Linh hoạt / Theo thỏa thuận"
    ];

    private static readonly IReadOnlyList<string> NoisePreferences =
    [
        "Cần rất yên tĩnh",
        "Mức độ bình thường",
        "Thích náo nhiệt / Thoải mái"
    ];

    private static readonly IReadOnlyList<string> CookingHabits =
    [
        "Nấu ăn thường xuyên",
        "Thỉnh thoảng nấu",
        "Không nấu ăn",
        "Chỉ nấu đồ đơn giản"
    ];

    private static readonly IReadOnlyList<string> Amenities =
    [
        "Có điều hòa",
        "Có nóng lạnh",
        "Có máy giặt",
        "Có tủ lạnh",
        "Có chỗ để xe",
        "Giờ giấc tự do / Không chung chủ",
        "Có ban công / Cửa sổ",
        "Có thang máy",
        "Cho phép nuôi thú cưng"
    ];

    private readonly List<string> _featureNames;

    public RoomFeatureEncoder()
    {
        _featureNames = new List<string>();

        // Non-budget criteria only (budget handled via range compatibility).
        foreach (var a in Areas) _featureNames.Add($"area:{a}");
        foreach (var t in RoomTypes) _featureNames.Add($"type:{t}");
        foreach (var s in SleepSchedules) _featureNames.Add($"sleep:{s}");
        _featureNames.Add("cleanliness"); // ordinal [0,1]
        foreach (var n in NoisePreferences) _featureNames.Add($"noise:{n}");
        foreach (var c in CookingHabits) _featureNames.Add($"cooking:{c}");
        foreach (var am in Amenities) _featureNames.Add($"amenity:{am}");
    }

    public IReadOnlyList<string> FeatureNames => _featureNames;

    public RoomFeatureResult Encode(RoomPreferences? preferences)
    {
        var features = new double[_featureNames.Count];
        var filled = 0;

        if (preferences is not null)
        {
            // Area (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.Area))
            {
                filled++;
                SetDimension($"area:{preferences.Area.Trim()}", 1d, features);
            }

            // Budget counted for coverage but NOT encoded into features.
            if (preferences.Budget is not null && BudgetParser.IsValid(preferences.Budget))
            {
                filled++;
            }

            // RoomType (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.RoomType))
            {
                filled++;
                SetDimension($"type:{preferences.RoomType.Trim()}", 1d, features);
            }

            // SleepSchedule (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.SleepSchedule))
            {
                filled++;
                SetDimension($"sleep:{preferences.SleepSchedule.Trim()}", 1d, features);
            }

            // Cleanliness (ordinal [0,1])
            if (!string.IsNullOrWhiteSpace(preferences.Cleanliness))
            {
                filled++;
                var ordinal = CleanlinessOrdinal(preferences.Cleanliness.Trim());
                SetDimension("cleanliness", ordinal, features);
            }

            // NoisePreference (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.NoisePreference))
            {
                filled++;
                SetDimension($"noise:{preferences.NoisePreference.Trim()}", 1d, features);
            }

            // CookingHabits (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.CookingHabits))
            {
                filled++;
                SetDimension($"cooking:{preferences.CookingHabits.Trim()}", 1d, features);
            }

            // Amenities (multi-hot)
            if (preferences.Amenities is { Count: > 0 })
            {
                filled++;
                foreach (var am in preferences.Amenities)
                {
                    SetDimension($"amenity:{am}", 1d, features);
                }
            }
        }

        var coverage = filled / 8d;

        return new RoomFeatureResult(features, coverage, filled, 8, preferences?.Budget);
    }

    private void SetDimension(string name, double value, double[] features)
    {
        var index = FeatureNameIndex(name);

        if (index >= 0)
        {
            features[index] = value;
        }
    }

    private int FeatureNameIndex(string name)
    {
        for (var i = 0; i < _featureNames.Count; i++)
        {
            if (_featureNames[i] == name)
            {
                return i;
            }
        }

        return -1;
    }

    private static double CleanlinessOrdinal(string value)
    {
        for (var i = 0; i < CleanlinessLevels.Count; i++)
        {
            if (string.Equals(CleanlinessLevels[i], value, StringComparison.OrdinalIgnoreCase))
            {
                return CleanlinessLevels.Count > 1 ? (double)i / (CleanlinessLevels.Count - 1) : 0d;
            }
        }

        return 0d;
    }
}
