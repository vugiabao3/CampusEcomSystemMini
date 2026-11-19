using CampusEcomSystemMini.Application.Matching.Normalization;
using Xunit;

namespace CampusEcomSystemMini.Tests.Normalization;

public class FuzzyMatcherTests
{
    [Fact]
    public void Exact_match_returns_canonical()
    {
        var map = AliasMaps.StudySubjects;
        var result = FuzzyMatcher.ResolveFuzzy("giai tich", map);

        Assert.Equal("Giải tích", result);
    }

    [Fact]
    public void Typo_tolerated_within_threshold()
    {
        var map = AliasMaps.StudySubjects;
        var result = FuzzyMatcher.ResolveFuzzy("giai tichh", map);

        Assert.Equal("Giải tích", result);
    }

    [Fact]
    public void Area_typo_resolved()
    {
        var map = AliasMaps.RoomAreas;
        var result = FuzzyMatcher.ResolveFuzzy("cau giayy", map);

        Assert.Equal("Cầu Giấy", result);
    }

    [Fact]
    public void Language_typo_resolved()
    {
        var map = AliasMaps.StudyLanguages;
        var result = FuzzyMatcher.ResolveFuzzy("javascrip", map);

        Assert.Equal("JavaScript", result);
    }

    [Fact]
    public void Null_input_returns_null()
    {
        Assert.Null(FuzzyMatcher.ResolveFuzzy(null, AliasMaps.StudySubjects));
    }

    [Fact]
    public void Unrelated_string_returns_null()
    {
        var map = AliasMaps.StudySubjects;
        var result = FuzzyMatcher.ResolveFuzzy("abcdefgh xyz", map);

        Assert.Null(result);
    }

    [Fact]
    public void Empty_map_returns_null()
    {
        Assert.Null(FuzzyMatcher.ResolveFuzzy("giai tich", new Dictionary<string, string>()));
    }

    [Fact]
    public void Normalized_distance_is_zero_for_identical()
    {
        Assert.Equal(0d, FuzzyMatcher.NormalizedDistance("abc", "abc"));
    }

    [Fact]
    public void Normalized_distance_is_one_for_empty_vs_nonempty()
    {
        Assert.Equal(1d, FuzzyMatcher.NormalizedDistance("", "abc"));
    }
}
