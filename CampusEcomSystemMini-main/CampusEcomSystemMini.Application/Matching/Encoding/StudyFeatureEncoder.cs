namespace CampusEcomSystemMini.Application.Matching.Encoding;

// Structured study-group preference input (canonical values, already
// normalized and alias-resolved by callers).
public record StudyPreferences(
    IReadOnlyList<string> Subjects,
    IReadOnlyList<string> Languages,
    string? Goal,
    string? Proficiency,
    string? StudyTime,
    string? Format,
    string? Method,
    string? Frequency);

public record StudyFeatureResult(
    double[] Features,
    double Coverage,      // fraction of the 8 criteria that are filled [0,1]
    int FilledCriteria,   // count of filled criteria
    int TotalCriteria = 8);

// Encodes study-group preferences into a fixed-length numerical feature
// vector suitable for cosine similarity.
//
// Encoding strategy per criterion:
//   - Subjects, Languages, Method, Format, StudyTime, Frequency:
//     multi-hot / one-hot categorical (one dimension per canonical value).
//     Missing -> 0 across all dimensions for that criterion.
//   - Goal: one-hot categorical.
//   - Proficiency: ordinal scaled to [0,1] (Mới bắt đầu=0, Cơ bản=0.5, Nâng cao=1).
//
// Nominal categories never get arbitrary integer ordering; each value gets
// its own binary dimension so cosine similarity measures overlap, not
// ordinal distance. Missing criteria contribute 0 to the vector and reduce
// coverage rather than being treated as "no preference".
public interface IStudyFeatureEncoder
{
    IReadOnlyList<string> FeatureNames { get; }

    StudyFeatureResult Encode(StudyPreferences? preferences);
}

public class StudyFeatureEncoder : IStudyFeatureEncoder
{
    // Fixed canonical vocabularies. Order is stable -> stable schema.
    // Must match AliasMaps canonical values exactly so encoded dimensions
    // line up with values stored in the database.
    private static readonly IReadOnlyList<string> Subjects =
    [
        "Cấu trúc dữ liệu và giải thuật",
        "Cơ sở dữ liệu",
        "Lập trình hướng đối tượng",
        "Toán rời rạc",
        "Giải tích 1",
        "Giải tích 2",
        "Giải tích 3",
        "Đại số tuyến tính",
        "Xác suất thống kê",
        "Vật lý đại cương",
        "Triết học Mác - Lênin",
        "Kinh tế chính trị Mác - Lênin",
        "Chủ nghĩa xã hội khoa học",
        "Tư tưởng Hồ Chí Minh",
        "Lịch sử Đảng Cộng sản Việt Nam",
        "Pháp luật đại cương",
        "Khoa học quản lý",
        "Quản trị học",
        "Kỹ thuật phần mềm",
        "Lập trình mạng",
        "Hệ điều hành",
        "Phát triển Web",
        "Lập trình di động",
        "An toàn thông tin",
        "Trí tuệ nhân tạo",
        "Quản trị dự án phần mềm"
    ];

    private static readonly IReadOnlyList<string> Languages =
    [
        "C",
        "C++",
        "C#",
        "Java",
        "Python",
        "JavaScript",
        "TypeScript",
        "PHP",
        "Go",
        "Rust",
        "Swift",
        "Kotlin",
        "SQL",
        "HTML/CSS"
    ];

    private static readonly IReadOnlyList<string> Goals =
    [
        "Ôn thi cuối kỳ",
        "Giải bài tập về nhà",
        "Làm đồ án môn học",
        "Làm đồ án tốt nghiệp",
        "Luyện phỏng vấn thực tập / đi làm",
        "Tự học nâng cao kỹ năng",
        "Nghiên cứu công nghệ mới"
    ];

    private static readonly IReadOnlyList<string> ProficiencyLevels =
    [
        "Mới bắt đầu (Chưa biết gì / Số 0)",
        "Cơ bản (Đã học lý thuyết)",
        "Nâng cao (Đã có kinh nghiệm làm dự án)",
        "Chuyên gia / Đã đi làm thực tế"
    ];

    private static readonly IReadOnlyList<string> StudyTimes =
    [
        "Buổi sáng (8h - 11h30)",
        "Buổi chiều (14h - 17h30)",
        "Buổi tối (19h - 22h)",
        "Cuối tuần (Thứ 7 & Chủ nhật)",
        "Giờ giấc linh hoạt theo lịch rảnh"
    ];

    private static readonly IReadOnlyList<string> Formats =
    [
        "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
        "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
        "Kết hợp (Hybrid: Online kết hợp Offline)"
    ];

    private static readonly IReadOnlyList<string> Methods =
    [
        "Thực hành code chung (Pair programming)",
        "Giải bài tập / Luyện đề thi",
        "Thảo luận lý thuyết & thiết kế hệ thống",
        "Code Review & Sửa lỗi (Debug)",
        "Thuyết trình & Chia sẻ kiến thức (Knowledge sharing)"
    ];

    private static readonly IReadOnlyList<string> Frequencies =
    [
        "Hàng ngày (7 ngày/tuần)",
        "3 buổi/tuần",
        "2 buổi/tuần",
        "Cuối tuần (Thứ 7 & Chủ nhật)",
        "Linh hoạt chạy theo deadline đồ án"
    ];

    private readonly List<string> _featureNames;

    public StudyFeatureEncoder()
    {
        _featureNames = new List<string>();

        // One dimension per canonical value for each categorical criterion,
        // plus one ordinal dimension for Proficiency.
        foreach (var s in Subjects) _featureNames.Add($"subject:{s}");
        foreach (var l in Languages) _featureNames.Add($"language:{l}");
        foreach (var g in Goals) _featureNames.Add($"goal:{g}");
        _featureNames.Add("proficiency"); // ordinal [0,1]
        foreach (var t in StudyTimes) _featureNames.Add($"time:{t}");
        foreach (var f in Formats) _featureNames.Add($"format:{f}");
        foreach (var m in Methods) _featureNames.Add($"method:{m}");
        foreach (var fr in Frequencies) _featureNames.Add($"frequency:{fr}");
    }

    public IReadOnlyList<string> FeatureNames => _featureNames;

    public StudyFeatureResult Encode(StudyPreferences? preferences)
    {
        var features = new double[_featureNames.Count];
        var filled = 0;

        if (preferences is not null)
        {
            // Subjects (multi-hot)
            if (preferences.Subjects is { Count: > 0 })
            {
                filled++;
                foreach (var s in preferences.Subjects)
                {
                    SetDimension($"subject:{s}", 1d, features);
                }
            }

            // Languages (multi-hot)
            if (preferences.Languages is { Count: > 0 })
            {
                filled++;
                foreach (var l in preferences.Languages)
                {
                    SetDimension($"language:{l}", 1d, features);
                }
            }

            // Goal (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.Goal))
            {
                filled++;
                SetDimension($"goal:{preferences.Goal.Trim()}", 1d, features);
            }

            // Proficiency (ordinal [0,1])
            if (!string.IsNullOrWhiteSpace(preferences.Proficiency))
            {
                filled++;
                var ordinal = ProficiencyOrdinal(preferences.Proficiency.Trim());
                SetDimension("proficiency", ordinal, features);
            }

            // StudyTime (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.StudyTime))
            {
                filled++;
                SetDimension($"time:{preferences.StudyTime.Trim()}", 1d, features);
            }

            // Format (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.Format))
            {
                filled++;
                SetDimension($"format:{preferences.Format.Trim()}", 1d, features);
            }

            // Method (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.Method))
            {
                filled++;
                SetDimension($"method:{preferences.Method.Trim()}", 1d, features);
            }

            // Frequency (one-hot)
            if (!string.IsNullOrWhiteSpace(preferences.Frequency))
            {
                filled++;
                SetDimension($"frequency:{preferences.Frequency.Trim()}", 1d, features);
            }
        }

        var coverage = filled / 8d;

        return new StudyFeatureResult(features, coverage, filled);
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

    private static double ProficiencyOrdinal(string value)
    {
        for (var i = 0; i < ProficiencyLevels.Count; i++)
        {
            if (string.Equals(ProficiencyLevels[i], value, StringComparison.OrdinalIgnoreCase))
            {
                return ProficiencyLevels.Count > 1 ? (double)i / (ProficiencyLevels.Count - 1) : 0d;
            }
        }

        return 0d;
    }
}
