namespace CampusEcomSystemMini.Application.Matching.Normalization;

// Resolves raw user input into canonical, domain-specific structured
// preferences. Applies the full pipeline:
//   Normalize -> Alias resolve -> Fuzzy resolve -> Canonical value.
//
// Returns null entries for unmatched / missing values rather than forcing
// a guess.
public static class PreferenceResolver
{
    // Resolve a multi-select list (subjects, languages, amenities).
    // Each item is normalized, alias-resolved, then fuzzy-resolved.
    public static List<string> ResolveMulti(
        IReadOnlyList<string>? rawValues,
        IReadOnlyDictionary<string, string> aliasMap)
    {
        var result = new List<string>();

        if (rawValues is null)
        {
            return result;
        }

        foreach (var raw in rawValues)
        {
            var normalized = TextNormalizer.Normalize(raw);

            if (normalized is null)
            {
                continue;
            }

            var canonical =
                AliasMaps.Resolve(normalized, aliasMap)
                ?? FuzzyMatcher.ResolveFuzzy(normalized, aliasMap);

            if (canonical is not null && !result.Contains(canonical))
            {
                result.Add(canonical);
            }
        }

        return result;
    }

    // Resolve a single-value field (goal, proficiency, area, etc.).
    public static string? ResolveSingle(
        string? rawValue,
        IReadOnlyDictionary<string, string> aliasMap)
    {
        var normalized = TextNormalizer.Normalize(rawValue);

        if (normalized is null)
        {
            return null;
        }

        return AliasMaps.Resolve(normalized, aliasMap)
            ?? FuzzyMatcher.ResolveFuzzy(normalized, aliasMap);
    }

    // Resolve a comma-separated string of multiple values, resolve each against
    // the alias map, and join canonical values back with ", ". Used for fields
    // that are multi-select in the UI but stored as a single comma-separated
    // string in the database (Goal, Time, Format, Method).
    public static string? ResolveMultiJoin(
        string? commaSeparated,
        IReadOnlyDictionary<string, string> aliasMap)
    {
        if (commaSeparated is null)
        {
            return null;
        }

        var parts = commaSeparated
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var resolved = new List<string>();
        foreach (var part in parts)
        {
            var canonical = ResolveSingle(part, aliasMap);
            if (canonical is not null && !resolved.Contains(canonical))
            {
                resolved.Add(canonical);
            }
        }

        return resolved.Count > 0 ? string.Join(", ", resolved) : null;
    }
}
