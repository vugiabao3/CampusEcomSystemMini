using CampusEcomSystemMini.Application.Matching.Normalization;
using Xunit;

namespace CampusEcomSystemMini.Tests.Normalization;

public class BudgetParserTests
{
    [Theory]
    [InlineData("Dưới 2 triệu", null, 2000000d)]
    [InlineData("Trên 3 triệu", 3000000d, null)]
    [InlineData("2-3 triệu", 2000000d, 3000000d)]
    [InlineData("2 đến 3 triệu", 2000000d, 3000000d)]
    [InlineData("2500000 VND", 2500000d, 2500000d)]
    [InlineData("2.5 triệu", 2500000d, 2500000d)]
    public void Parses_valid_budgets(string input, double? min, double? max)
    {
        var range = BudgetParser.Parse(input);

        Assert.NotNull(range);
        Assert.Equal(min, (double?)range!.MinVnd);
        Assert.Equal(max, (double?)range!.MaxVnd);
        Assert.True(BudgetParser.IsValid(range));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("abc")]
    [InlineData("-1 triệu")]
    public void Returns_null_for_invalid(string input)
    {
        var range = BudgetParser.Parse(input);

        Assert.Null(range);
        Assert.False(BudgetParser.IsValid(range));
    }

    [Theory]
    [InlineData("Dưới 2 triệu", "2-3 triệu", 0.25)]   // touch at 2M boundary
    [InlineData("Trên 3 triệu", "2-3 triệu", 0.25)]    // touch at 3M boundary
    [InlineData("Dưới 1 triệu", "Trên 3 triệu", 0.0)]  // disjoint
    [InlineData("2.5 triệu", "2.5 triệu", 1.0)]        // identical points
    public void Compatibility_scores_ranges(
        string a, string b, double expected)
    {
        var ra = BudgetParser.Parse(a);
        var rb = BudgetParser.Parse(b);

        var score = BudgetParser.Compatibility(ra, rb);

        Assert.Equal(expected, score, 2);
    }

    [Fact]
    public void Missing_budget_has_zero_compatibility()
    {
        var ra = BudgetParser.Parse("2 triệu");
        var rb = BudgetParser.Parse(null);

        Assert.Equal(0d, BudgetParser.Compatibility(ra, rb));
        Assert.Equal(0d, BudgetParser.Compatibility(null, null));
    }
}
