using CampusEcomSystemMini.Application.Matching.Encoding;
using Xunit;

namespace CampusEcomSystemMini.Tests.Encoding;

public class StudyFeatureEncoderTests
{
    private readonly StudyFeatureEncoder _encoder = new();

    [Fact]
    public void Null_preference_returns_zero_vector_and_zero_coverage()
    {
        var result = _encoder.Encode(null);

        Assert.All(result.Features, f => Assert.Equal(0d, f));
        Assert.Equal(0d, result.Coverage);
        Assert.Equal(0, result.FilledCriteria);
    }

    [Fact]
    public void Empty_preference_returns_zero_coverage()
    {
        var result = _encoder.Encode(new StudyPreferences([], [], null, null, null, null, null, null));

        Assert.Equal(0d, result.Coverage);
        Assert.Equal(0, result.FilledCriteria);
    }

    [Fact]
    public void Fully_filled_preference_has_full_coverage()
    {
        var pref = new StudyPreferences(
            ["Cấu trúc dữ liệu và giải thuật"],
            ["C#"],
            "Ôn thi cuối kỳ",
            "Cơ bản (Đã học lý thuyết)",
            "Buổi sáng (8h - 11h30)",
            "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            "Thực hành code chung (Pair programming)",
            "Hàng ngày (7 ngày/tuần)");

        var result = _encoder.Encode(pref);

        Assert.Equal(1d, result.Coverage);
        Assert.Equal(8, result.FilledCriteria);
        Assert.True(result.Features.Any(f => f != 0d));
    }

    [Fact]
    public void Stable_dimensions_for_same_schema()
    {
        var a = _encoder.Encode(new StudyPreferences(["Cấu trúc dữ liệu và giải thuật"], ["C#"], null, null, null, null, null, null));
        var b = _encoder.Encode(new StudyPreferences(["Cơ sở dữ liệu"], ["Java"], null, null, null, null, null, null));

        Assert.Equal(a.Features.Length, b.Features.Length);
        Assert.Equal(_encoder.FeatureNames.Count, a.Features.Length);
    }

    [Fact]
    public void Nominal_categories_not_ordered()
    {
        // C# and Java should be different dimensions, not ordered integers.
        var csharp = _encoder.Encode(new StudyPreferences([], ["C#"], null, null, null, null, null, null));
        var java = _encoder.Encode(new StudyPreferences([], ["Java"], null, null, null, null, null, null));

        var dot = 0d;
        for (var i = 0; i < csharp.Features.Length; i++)
        {
            dot += csharp.Features[i] * java.Features[i];
        }

        Assert.Equal(0d, dot);
    }

    [Fact]
    public void Proficiency_is_ordinal_scaled()
    {
        var beginner = _encoder.Encode(new StudyPreferences([], [], null, "Mới bắt đầu (Chưa biết gì / Số 0)", null, null, null, null));
        var basic = _encoder.Encode(new StudyPreferences([], [], null, "Cơ bản (Đã học lý thuyết)", null, null, null, null));
        var expert = _encoder.Encode(new StudyPreferences([], [], null, "Chuyên gia / Đã đi làm thực tế", null, null, null, null));

        var proficiencyIndex = Array.IndexOf(_encoder.FeatureNames.ToArray(), "proficiency");
        Assert.True(beginner.Features[proficiencyIndex] < basic.Features[proficiencyIndex]);
        Assert.True(basic.Features[proficiencyIndex] < expert.Features[proficiencyIndex]);
        Assert.Equal(0d, beginner.Features[proficiencyIndex]);
        Assert.Equal(1d / 3d, basic.Features[proficiencyIndex], 5);
        Assert.Equal(1d, expert.Features[proficiencyIndex]);
    }
}
