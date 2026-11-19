using CampusEcomSystemMini.Application.Matching.Normalization;
using Xunit;

namespace CampusEcomSystemMini.Tests.Normalization;

public class PreferenceResolverTests
{
    [Fact]
    public void Resolve_multi_applies_alias_and_fuzzy()
    {
        var result = PreferenceResolver.ResolveMulti(
            ["csdl", "giai tichh", "c++", "unknown xyz"],
            AliasMaps.StudySubjects.Concat(AliasMaps.StudyLanguages)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value, StringComparer.OrdinalIgnoreCase));

        Assert.Contains("Cơ sở dữ liệu", result);
        Assert.Contains("Giải tích", result);
        Assert.Contains("C++", result);
        Assert.DoesNotContain("unknown xyz", result);
    }

    [Fact]
    public void Resolve_single_returns_canonical_or_null()
    {
        var area = PreferenceResolver.ResolveSingle("cau giay", AliasMaps.RoomAreas);
        Assert.Equal("Cầu Giấy", area);

        var lang = PreferenceResolver.ResolveSingle("js", AliasMaps.StudyLanguages);
        Assert.Equal("JavaScript", lang);

        var none = PreferenceResolver.ResolveSingle("not a real thing", AliasMaps.StudyGoals);
        Assert.Null(none);

        var nullInput = PreferenceResolver.ResolveSingle(null, AliasMaps.StudyGoals);
        Assert.Null(nullInput);
    }
}
