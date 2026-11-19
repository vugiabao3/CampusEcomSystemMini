using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Services;
using CampusEcomSystemMini.Application.Matching.Similarity;
using Xunit;

namespace CampusEcomSystemMini.Tests.Matching;

public class StudyMatchingServiceTests
{
    private readonly StudyMatchingService _service =
        new(new StudyFeatureEncoder(), new CosineSimilarityCalculator());

    [Fact]
    public void Identical_preferences_return_score_one_and_full_coverage()
    {
        var pref = new StudyPreferences(
            ["Cấu trúc dữ liệu và giải thuật", "Cơ sở dữ liệu"],
            ["C#", "Java"],
            "Ôn thi cuối kỳ",
            "Cơ bản (Đã học lý thuyết)",
            "Buổi sáng (8h - 11h30)",
            "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            "Thực hành code chung (Pair programming)",
            "Hàng ngày (7 ngày/tuần)");

        var result = _service.Compute(pref, pref);

        Assert.Equal(1d, result.Score, 5);
        Assert.Equal(1d, result.Coverage);
        Assert.Equal(8, result.FilledCriteria);
        Assert.Equal(8, result.MatchedCriteria.Count);
    }

    [Fact]
    public void Completely_different_preferences_return_low_score()
    {
        var a = new StudyPreferences(
            ["Cấu trúc dữ liệu và giải thuật"], ["C#"], "Ôn thi cuối kỳ", "Mới bắt đầu (Chưa biết gì / Số 0)", "Buổi sáng (8h - 11h30)", "Trực tiếp (Offline tại trường, thư viện, quán cafe)", "Thực hành code chung (Pair programming)", "Hàng ngày (7 ngày/tuần)");
        var b = new StudyPreferences(
            ["Cơ sở dữ liệu"], ["Python"], "Làm đồ án môn học", "Nâng cao (Đã có kinh nghiệm làm dự án)", "Buổi tối (19h - 22h)", "Trực tuyến (Online qua Zoom, Discord, Google Meet)", "Thảo luận lý thuyết & thiết kế hệ thống", "Cuối tuần (Thứ 7 & Chủ nhật)");

        var result = _service.Compute(a, b);

        Assert.Equal(0d, result.Score, 5);
        Assert.Equal(1d, result.Coverage);
        Assert.Empty(result.MatchedCriteria);
        Assert.Equal(8, result.UnmatchedCriteria.Count);
    }

    [Fact]
    public void Missing_preferences_return_zero_coverage()
    {
        var result = _service.Compute(null, null);

        Assert.Equal(0d, result.Score);
        Assert.Equal(0d, result.Coverage);
        Assert.Equal(0, result.FilledCriteria);
    }

    [Fact]
    public void Partial_overlap_returns_between_zero_and_one()
    {
        var a = new StudyPreferences(["Cấu trúc dữ liệu và giải thuật"], ["C#"], null, null, null, null, null, null);
        var b = new StudyPreferences(["Cấu trúc dữ liệu và giải thuật"], ["Java"], null, null, null, null, null, null);

        var result = _service.Compute(a, b);

        Assert.InRange(result.Score, 0d, 1d);
        Assert.InRange(result.Coverage, 0d, 1d);
        Assert.Contains("Môn học", result.MatchedCriteria.SingleOrDefault(m => m.StartsWith("Môn học")) ?? "");
    }

    [Fact]
    public void Score_and_coverage_are_distinct()
    {
        // Only one criterion filled but matching -> high score, low coverage.
        var a = new StudyPreferences(["Cấu trúc dữ liệu và giải thuật"], [], null, null, null, null, null, null);
        var b = new StudyPreferences(["Cấu trúc dữ liệu và giải thuật"], [], null, null, null, null, null, null);

        var result = _service.Compute(a, b);

        Assert.Equal(1d, result.Score);
        Assert.Equal(0.125d, result.Coverage); // 1 of 8
    }
}
