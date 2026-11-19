using System.Globalization;
using System.Text;

namespace CampusEcomSystemMini.Application.Matching.Normalization;

// Shared, deterministic text normalization pipeline.
// Pure static utilities — no infrastructure dependencies, directly unit-testable.
//
// Pipeline order (explicit and deterministic):
//   Raw Input -> Unicode Normalization (NFC) -> Case folding -> Whitespace collapse
//   -> Diacritic stripping (accent-insensitive form) -> Alias resolution
//   -> Synonym mapping -> Fuzzy matching -> Canonical value
//
// Vietnamese diacritics are stripped only for matching; the original
// display value is preserved separately by callers.
public static class TextNormalizer
{
    private static readonly char[] VietnameseWithDiacritics =
    [
        // Base horn / stroke letters (no tone mark).
        'â', 'ê', 'ô', 'ơ', 'ư', 'đ',
        'Â', 'Ê', 'Ô', 'Ơ', 'Ư', 'Đ',
        // Vowels with tone marks.
        'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
        'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
        'ì', 'í', 'ị', 'ỉ', 'ĩ',
        'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
        'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
        'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
        'đ',
        'À', 'Á', 'Ạ', 'Ả', 'Ã', 'Â', 'Ầ', 'Ấ', 'Ậ', 'Ẩ', 'Ẫ', 'Ă', 'Ằ', 'Ắ', 'Ặ', 'Ẳ', 'Ẵ',
        'È', 'É', 'Ẹ', 'Ẻ', 'Ẽ', 'Ê', 'Ề', 'Ế', 'Ệ', 'Ể', 'Ễ',
        'Ì', 'Í', 'Ị', 'Ỉ', 'Ĩ',
        'Ò', 'Ó', 'Ọ', 'Ỏ', 'Õ', 'Ô', 'Ồ', 'Ố', 'Ộ', 'Ổ', 'Ỗ', 'Ơ', 'Ờ', 'Ớ', 'Ợ', 'Ở', 'Ỡ',
        'Ù', 'Ú', 'Ụ', 'Ủ', 'Ũ', 'Ư', 'Ừ', 'Ứ', 'Ự', 'Ử', 'Ữ',
        'Ỳ', 'Ý', 'Ỵ', 'Ỷ', 'Ỹ',
        'Đ'
    ];

    private static readonly char[] VietnameseWithoutDiacritics =
    [
        // Base horn / stroke letters.
        'a', 'e', 'o', 'o', 'u', 'd',
        'A', 'E', 'O', 'O', 'U', 'D',
        // Vowels with tone marks.
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i',
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
        'y', 'y', 'y', 'y', 'y',
        'd',
        'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
        'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
        'I', 'I', 'I', 'I', 'I',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
        'Y', 'Y', 'Y', 'Y', 'Y',
        'D'
    ];

    // Normalize a raw user-entered string into a matching-safe canonical form.
    // Returns null for null/empty/whitespace input.
    public static string? Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        // 1. Unicode normalization (NFC) — canonical composition.
        var normalized = value.Normalize(NormalizationForm.FormC);

        // 2. Case folding — culture-invariant lowercase.
        normalized = normalized.ToLowerInvariant();

        // 3. Whitespace collapse — tabs/newlines/repeated spaces -> single space.
        normalized = CollapseWhitespace(normalized);

        // 4. Vietnamese diacritic removal -> accent-insensitive matching form.
        normalized = StripVietnameseDiacritics(normalized);

        // 5. Trim again after transformations.
        normalized = normalized.Trim();

        return normalized.Length == 0 ? null : normalized;
    }

    // Accent-insensitive comparison form of a normalized string.
    // Two strings are "accent-equivalent" if their diacritic-stripped forms are equal.
    public static string? ToAccentInsensitive(string? value)
    {
        if (value is null)
        {
            return null;
        }

        return StripVietnameseDiacritics(value).ToLowerInvariant();
    }

    private static string CollapseWhitespace(string value)
    {
        var result = new StringBuilder(value.Length);
        var inWhitespace = false;

        foreach (var ch in value)
        {
            if (char.IsWhiteSpace(ch))
            {
                if (!inWhitespace)
                {
                    result.Append(' ');
                    inWhitespace = true;
                }
            }
            else
            {
                result.Append(ch);
                inWhitespace = false;
            }
        }

        return result.ToString();
    }

    private static string StripVietnameseDiacritics(string value)
    {
        var result = new StringBuilder(value.Length);

        foreach (var ch in value)
        {
            var index = Array.IndexOf(VietnameseWithDiacritics, ch);
            result.Append(index >= 0 ? VietnameseWithoutDiacritics[index] : ch);
        }

        return result.ToString();
    }

    // Tokenize a normalized string into a set of lowercase words.
    // Programming-language tokens such as C# and C++ are preserved intact.
    public static HashSet<string> Tokenize(string? value)
    {
        var tokens = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(value))
        {
            return tokens;
        }

        // Normalize first (lowercase, strip diacritics, collapse whitespace)
        // so tokens are accent-insensitive and comparable.
        var normalized = Normalize(value);

        if (normalized is null)
        {
            return tokens;
        }

        var current = new StringBuilder();

        foreach (var ch in normalized)
        {
            // Keep letters, digits, and language-significant symbols (#, +).
            if (char.IsLetterOrDigit(ch) || ch == '#' || ch == '+')
            {
                current.Append(ch);
            }
            else
            {
                if (current.Length > 0)
                {
                    tokens.Add(current.ToString());
                    current.Clear();
                }
            }
        }

        if (current.Length > 0)
        {
            tokens.Add(current.ToString());
        }

        return tokens;
    }
}
