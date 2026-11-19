using CampusEcomSystemMini.Application.Matching.Normalization;
using Xunit;

namespace CampusEcomSystemMini.Tests.Normalization;

public class TextNormalizerTests
{
    [Fact]
    public void Null_or_whitespace_returns_null()
    {
        Assert.Null(TextNormalizer.Normalize(null));
        Assert.Null(TextNormalizer.Normalize(""));
        Assert.Null(TextNormalizer.Normalize("   "));
        Assert.Null(TextNormalizer.Normalize("\t\n"));
    }

    [Fact]
    public void Collapses_whitespace_and_trims()
    {
        Assert.Equal("giai tich", TextNormalizer.Normalize("  GIẢI   TÍCH  "));
        Assert.Equal("co so du lieu", TextNormalizer.Normalize("  Cơ sở    dữ liệu "));
        Assert.Equal("mang may tinh", TextNormalizer.Normalize("Mạng\t\tmáy\n\ttính"));
    }

    [Fact]
    public void Preserves_language_symbols()
    {
        Assert.Equal("c#", TextNormalizer.Normalize("C#"));
        Assert.Equal("c++", TextNormalizer.Normalize("C++"));
        Assert.Equal("javascript", TextNormalizer.Normalize("JavaScript"));
    }

    [Fact]
    public void Strips_vietnamese_diacritics()
    {
        Assert.Equal("giai tich", TextNormalizer.Normalize("Giải tích"));
        Assert.Equal("co so du lieu", TextNormalizer.Normalize("Cơ sở dữ liệu"));
        Assert.Equal("cau giay", TextNormalizer.Normalize("Cầu Giấy"));
    }

    [Fact]
    public void Accent_insensitive_forms_match()
    {
        var a = TextNormalizer.ToAccentInsensitive("Giải tích");
        var b = TextNormalizer.ToAccentInsensitive("giai tich");
        Assert.Equal(a, b);

        var c = TextNormalizer.ToAccentInsensitive("Cầu Giấy");
        var d = TextNormalizer.ToAccentInsensitive("Cau Giay");
        Assert.Equal(c, d);
    }

    [Fact]
    public void Normalize_lowercases_and_strips_diacritics()
    {
        Assert.Equal("giai tich", TextNormalizer.Normalize("Giải tích"));
        Assert.Equal("co so du lieu", TextNormalizer.Normalize("Cơ sở dữ liệu"));
        Assert.Equal("cau giay", TextNormalizer.Normalize("Cầu Giấy"));
        Assert.Equal("duoi 2 trieu", TextNormalizer.Normalize("Dưới 2 triệu"));
    }

    [Fact]
    public void Tokenize_preserves_language_symbols()
    {
        var tokens = TextNormalizer.Tokenize("C# C++ JavaScript Java");
        Assert.Contains("c#", tokens);
        Assert.Contains("c++", tokens);
        Assert.Contains("javascript", tokens);
        Assert.Contains("java", tokens);
    }

    [Fact]
    public void Tokenize_splits_on_punctuation()
    {
        var tokens = TextNormalizer.Tokenize("Giải tích, Cấu trúc dữ liệu");
        Assert.Contains("giai", tokens);
        Assert.Contains("tich", tokens);
        Assert.Contains("cau", tokens);
        Assert.Contains("truc", tokens);
        Assert.Contains("du", tokens);
        Assert.Contains("lieu", tokens);
    }
}
