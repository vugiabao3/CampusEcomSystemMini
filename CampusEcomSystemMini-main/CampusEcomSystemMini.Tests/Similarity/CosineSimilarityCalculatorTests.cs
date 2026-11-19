using CampusEcomSystemMini.Application.Matching.Similarity;
using Xunit;

namespace CampusEcomSystemMini.Tests.Similarity;

public class CosineSimilarityCalculatorTests
{
    private readonly CosineSimilarityCalculator _calc = new();

    [Fact]
    public void Identical_vectors_return_one()
    {
        var score = _calc.Calculate([1d, 1d, 0d, 1d], [1d, 1d, 0d, 1d]);

        Assert.Equal(1d, score, 5);
    }

    [Fact]
    public void Illustrative_example_matches_spec()
    {
        // A = [1, 1, 0, 1], B = [1, 1, 1, 1] -> 3 / (2√3) ≈ 0.866
        var score = _calc.Calculate([1d, 1d, 0d, 1d], [1d, 1d, 1d, 1d]);

        var expected = 3d / (2d * Math.Sqrt(3));
        Assert.Equal(expected, score, 5);
        Assert.InRange(score, 0.86, 0.87);
    }

    [Fact]
    public void Completely_different_vectors_return_zero()
    {
        var score = _calc.Calculate([1d, 0d, 0d], [0d, 1d, 0d]);

        Assert.Equal(0d, score);
    }

    [Fact]
    public void Zero_vector_returns_zero_no_division_by_zero()
    {
        var scoreA = _calc.Calculate([0d, 0d, 0d], [1d, 1d, 1d]);
        var scoreB = _calc.Calculate([1d, 1d, 1d], [0d, 0d, 0d]);
        var scoreBoth = _calc.Calculate([0d, 0d, 0d], [0d, 0d, 0d]);

        Assert.Equal(0d, scoreA);
        Assert.Equal(0d, scoreB);
        Assert.Equal(0d, scoreBoth);
    }

    [Fact]
    public void Null_or_empty_returns_zero()
    {
        Assert.Equal(0d, _calc.Calculate(null, [1d, 1d]));
        Assert.Equal(0d, _calc.Calculate([1d, 1d], null));
        Assert.Equal(0d, _calc.Calculate([], [1d, 1d]));
    }

    [Fact]
    public void Mismatched_dimensions_return_zero()
    {
        Assert.Equal(0d, _calc.Calculate([1d, 1d], [1d, 1d, 1d]));
    }

    [Fact]
    public void Result_is_within_bounds()
    {
        var score = _calc.Calculate([1d, 2d, 3d], [4d, 5d, 6d]);

        Assert.InRange(score, 0d, 1d);
    }

    [Fact]
    public void Partial_overlap()
    {
        var score = _calc.Calculate([1d, 1d, 0d], [1d, 0d, 1d]);

        // dot=1, |A|=√2, |B|=√2 -> 1/2 = 0.5
        Assert.Equal(0.5d, score, 5);
    }
}
