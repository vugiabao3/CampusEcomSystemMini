using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Normalization;
using CampusEcomSystemMini.Application.Matching.Services;
using CampusEcomSystemMini.Application.Matching.Similarity;
using Xunit;

namespace CampusEcomSystemMini.Tests.Matching;

public class RoomMatchingServiceTests
{
    private readonly RoomMatchingService _service =
        new(new RoomFeatureEncoder(), new CosineSimilarityCalculator());

    [Fact]
    public void Identical_preferences_return_score_one_and_full_coverage()
    {
        var pref = new RoomPreferences(
            "Cầu Giấy",
            new BudgetRange(2_000_000, 3_000_000),
            "Phòng trọ khép kín",
            "Ngủ sớm (trước 23h)",
            "Rất sạch sẽ, ngăn nắp",
            "Cần rất yên tĩnh",
            "Nấu ăn thường xuyên",
            ["Có điều hòa", "Có máy giặt"]);

        var result = _service.Compute(pref, pref);

        Assert.Equal(1d, result.Score, 5);
        Assert.Equal(1d, result.Coverage);
        Assert.Equal(8, result.FilledCriteria);
    }

    [Fact]
    public void Completely_different_preferences_return_low_score()
    {
        var a = new RoomPreferences(
            "Cầu Giấy", new BudgetRange(2_000_000, 2_000_000),
            "Phòng trọ khép kín", "Ngủ sớm (trước 23h)", "Rất sạch sẽ, ngăn nắp", "Cần rất yên tĩnh", "Nấu ăn thường xuyên", ["Có điều hòa"]);
        var b = new RoomPreferences(
            "Hà Đông", new BudgetRange(5_000_000, 5_000_000),
            "Chung cư nguyên căn", "Ngủ muộn (sau 24h)", "Linh hoạt / Theo thỏa thuận", "Thích náo nhiệt / Thoải mái", "Không nấu ăn", ["Có thang máy"]);

        var result = _service.Compute(a, b);

        Assert.Equal(0d, result.Score, 5);
        Assert.Equal(1d, result.Coverage);
    }

    [Fact]
    public void Budget_overlap_raises_score_even_when_other_fields_differ()
    {
        var sameBudget = new RoomPreferences(
            null, new BudgetRange(2_000_000, 3_000_000), null, null, null, null, null, []);
        var differentBudget = new RoomPreferences(
            null, new BudgetRange(8_000_000, 9_000_000), null, null, null, null, null, []);

        var withOverlap = _service.Compute(sameBudget, sameBudget);
        var withoutOverlap = _service.Compute(sameBudget, differentBudget);

        // Only budget matches: budget weight is 1/8 = 0.125.
        Assert.Equal(0.125d, withOverlap.Score, 3);
        Assert.True(withoutOverlap.Score < withOverlap.Score);
    }

    [Fact]
    public void Missing_preferences_return_zero_coverage()
    {
        var result = _service.Compute(null, null);

        Assert.Equal(0d, result.Score);
        Assert.Equal(0d, result.Coverage);
    }

    [Fact]
    public void Score_and_coverage_are_distinct()
    {
        var a = new RoomPreferences("Cầu Giấy", null, null, null, null, null, null, []);
        var b = new RoomPreferences("Cầu Giấy", null, null, null, null, null, null, []);

        var result = _service.Compute(a, b);

        // Area matches (7/8 weight), budget missing (0 contribution).
        Assert.Equal(0.875d, result.Score, 3);
        Assert.Equal(0.125d, result.Coverage); // 1 of 8
    }
}
