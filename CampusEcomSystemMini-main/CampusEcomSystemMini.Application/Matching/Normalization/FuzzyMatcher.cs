namespace CampusEcomSystemMini.Application.Matching.Normalization;

// Levenshtein distance based fuzzy matcher for typo tolerance.
// Compares accent-insensitive, normalized strings. Returns the best
// unambiguous canonical candidate within a length-aware threshold.
public static class FuzzyMatcher
{
    // Compute Levenshtein distance between two strings.
    public static int Distance(string a, string b)
    {
        if (string.IsNullOrEmpty(a))
        {
            return string.IsNullOrEmpty(b) ? 0 : b.Length;
        }

        if (string.IsNullOrEmpty(b))
        {
            return a.Length;
        }

        // Use only two rows to keep memory O(min(a,b)).
        if (a.Length < b.Length)
        {
            (a, b) = (b, a);
        }

        var previous = new int[b.Length + 1];
        var current = new int[b.Length + 1];

        for (var j = 0; j <= b.Length; j++)
        {
            previous[j] = j;
        }

        for (var i = 1; i <= a.Length; i++)
        {
            current[0] = i;

            for (var j = 1; j <= b.Length; j++)
            {
                var cost = a[i - 1] == b[j - 1] ? 0 : 1;

                current[j] = Math.Min(
                    Math.Min(previous[j] + 1, current[j - 1] + 1),
                    previous[j - 1] + cost);
            }

            (previous, current) = (current, previous);
        }

        return previous[b.Length];
    }

    // Normalized edit distance in [0, 1]: 0 = identical, 1 = completely different.
    public static double NormalizedDistance(string a, string b)
    {
        var maxLen = Math.Max(a.Length, b.Length);

        if (maxLen == 0)
        {
            return 0d;
        }

        return (double)Distance(a, b) / maxLen;
    }

    // Find the best canonical candidate for a normalized input value.
    //
    // - exact match (distance 0) wins immediately;
    // - otherwise the candidate with the smallest normalized distance
    //   within the threshold wins, provided no tie;
    // - returns null when no candidate is within threshold or the match
    //   is ambiguous (multiple candidates equally close).
    public static string? ResolveFuzzy(
        string? normalizedInput,
        IReadOnlyDictionary<string, string> aliasMap,
        double maxNormalizedDistance = 0.25d)
    {
        if (normalizedInput is null)
        {
            return null;
        }

        if (aliasMap.Count == 0)
        {
            return null;
        }

        // Exact (alias) match first.
        if (aliasMap.TryGetValue(normalizedInput, out var exact))
        {
            return exact;
        }

        string? bestCandidate = null;
        double bestDistance = double.MaxValue;
        var tie = false;

        foreach (var (key, canonical) in aliasMap)
        {
            var distance = NormalizedDistance(normalizedInput, key);

            if (distance > maxNormalizedDistance)
            {
                continue;
            }

            if (distance < bestDistance - 1e-9d)
            {
                bestDistance = distance;
                bestCandidate = canonical;
                tie = false;
            }
            else if (Math.Abs(distance - bestDistance) <= 1e-9d)
            {
                tie = true;
            }
        }

        // Ambiguous: multiple candidates equally close -> do not force a match.
        if (tie || bestCandidate is null)
        {
            return null;
        }

        return bestCandidate;
    }
}
