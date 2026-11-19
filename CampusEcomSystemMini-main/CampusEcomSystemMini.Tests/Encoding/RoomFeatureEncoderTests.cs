using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Normalization;
using Xunit;

namespace CampusEcomSystemMini.Tests.Encoding;

public class RoomFeatureEncoderTests
{
    private readonly RoomFeatureEncoder _encoder = new();

    [Fact]
    public void Null_preference_returns_zero_vector_and_zero_coverage()
    {
        var result = _encoder.Encode(null);

        Assert.All(result.Features, f => Assert.Equal(0d, f));
        Assert.Equal(0d, result.Coverage);
        Assert.Equal(0, result.FilledCriteria);
    }

    [Fact]
    public void Fully_filled_preference_has_full_coverage_including_budget()
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

        var result = _encoder.Encode(pref);

        Assert.Equal(1d, result.Coverage);
        Assert.Equal(8, result.FilledCriteria);
        Assert.True(result.Features.Any(f => f != 0d));
        Assert.Equal(new BudgetRange(2_000_000, 3_000_000), result.Budget);
    }

    [Fact]
    public void Budget_excluded_from_features_but_counted_in_coverage()
    {
        var withBudget = _encoder.Encode(new RoomPreferences(
            null, new BudgetRange(2_000_000, 3_000_000), null, null, null, null, null, []));

        var withoutBudget = _encoder.Encode(new RoomPreferences(
            null, null, null, null, null, null, null, []));

        Assert.Equal(1d / 8, withBudget.Coverage);
        Assert.Equal(0d, withoutBudget.Coverage);
    }

    [Fact]
    public void Amenities_use_multi_hot()
    {
        var one = _encoder.Encode(new RoomPreferences(
            null, null, null, null, null, null, null, ["Có điều hòa"]));

        var two = _encoder.Encode(new RoomPreferences(
            null, null, null, null, null, null, null, ["Có điều hòa", "Có máy giặt"]));

        var acIndex = Array.IndexOf(_encoder.FeatureNames.ToArray(), "amenity:Có điều hòa");
        var wmIndex = Array.IndexOf(_encoder.FeatureNames.ToArray(), "amenity:Có máy giặt");

        Assert.Equal(1d, one.Features[acIndex]);
        Assert.Equal(0d, one.Features[wmIndex]);
        Assert.Equal(1d, two.Features[acIndex]);
        Assert.Equal(1d, two.Features[wmIndex]);
    }

    [Fact]
    public void Cleanliness_is_ordinal()
    {
        var veryNeat = _encoder.Encode(new RoomPreferences(
            null, null, null, null, "Rất sạch sẽ, ngăn nắp", null, null, []));
        var normal = _encoder.Encode(new RoomPreferences(
            null, null, null, null, "Bình thường / Thoải mái", null, null, []));
        var flexible = _encoder.Encode(new RoomPreferences(
            null, null, null, null, "Linh hoạt / Theo thỏa thuận", null, null, []));

        var idx = Array.IndexOf(_encoder.FeatureNames.ToArray(), "cleanliness");
        Assert.Equal(0d, veryNeat.Features[idx]);
        Assert.Equal(2d / 3d, normal.Features[idx], 5);
        Assert.Equal(1d, flexible.Features[idx]);
    }
}
