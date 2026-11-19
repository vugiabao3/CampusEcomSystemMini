using System.Globalization;

namespace CampusEcomSystemMini.Application.Matching.Normalization;

// Rule-based parser for Vietnamese budget expressions.
//
// Supported forms:
//   "Dưới 2 triệu"          -> max 2,000,000
//   "2-3 triệu"             -> min 2,000,000, max 3,000,000
//   "2 đến 3 triệu"         -> min 2,000,000, max 3,000,000
//   "Trên 3 triệu"          -> min 3,000,000
//   "2500000 VND"           -> min 2,500,000, max 2,500,000
//   "2.5 triệu"             -> min 2,500,000, max 2,500,000
//
// Returns null for invalid / unparseable input (caller decides how to handle).
public record BudgetRange(decimal? MinVnd, decimal? MaxVnd);

public static class BudgetParser
{
    private const decimal Million = 1_000_000m;

    // Parse a raw budget string into a BudgetRange (min/max in VND).
    // Returns null when the value cannot be interpreted as a budget.
    public static BudgetRange? Parse(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        var text = TextNormalizer.Normalize(raw);

        if (text is null)
        {
            return null;
        }

        // "dưới X" -> open upper bound
        if (text.StartsWith("duoi "))
        {
            var rest = text["duoi ".Length..].Trim();
            var amount = ParseAmount(rest);

            if (!amount.HasValue)
            {
                return null;
            }

            return new BudgetRange(null, amount.Value);
        }

        // "tren X" -> open lower bound
        if (text.StartsWith("tren "))
        {
            var rest = text["tren ".Length..].Trim();
            var amount = ParseAmount(rest);

            if (!amount.HasValue)
            {
                return null;
            }

            return new BudgetRange(amount.Value, null);
        }

        // range "X den Y" / "X-Y" / "X đến Y"
        var range = ParseRange(text);

        if (range is not null)
        {
            return range;
        }

        // single value "X" / "X trieu" / "X VND"
        var single = ParseAmount(text);

        if (!single.HasValue)
        {
            return null;
        }

        return new BudgetRange(single.Value, single.Value);
    }

    private static BudgetRange? ParseRange(string text)
    {
        // Detect shared multiplier suffix (e.g. "2-3 triệu" -> both parts in millions).
        decimal sharedMultiplier = 1m;
        var rangeText = text;

        if (rangeText.EndsWith("trieu"))
        {
            sharedMultiplier = Million;
            rangeText = rangeText[..^5].Trim();
        }
        else if (rangeText.EndsWith("tr "))
        {
            sharedMultiplier = Million;
            rangeText = rangeText[..^3].Trim();
        }
        else if (rangeText.EndsWith("tr"))
        {
            sharedMultiplier = Million;
            rangeText = rangeText[..^2].Trim();
        }

        // Normalize separators: "den", "-", "to"
        var separators = new[] { " den ", " - ", " to ", "-", "–", "—" };

        foreach (var sep in separators)
        {
            if (rangeText.Contains(sep))
            {
                var parts = rangeText.Split(sep, StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

                if (parts.Length == 2)
                {
                    var low = ParseAmountWithSharedMultiplier(parts[0], sharedMultiplier);
                    var high = ParseAmountWithSharedMultiplier(parts[1], sharedMultiplier);

                    if (low.HasValue && high.HasValue)
                    {
                        var min = Math.Min(low.Value, high.Value);
                        var max = Math.Max(low.Value, high.Value);

                        return new BudgetRange(min, max);
                    }
                }
            }
        }

        return null;
    }

    // Parse an amount with an optional shared multiplier applied when the
    // individual part has no explicit unit suffix.
    private static decimal? ParseAmountWithSharedMultiplier(string text, decimal sharedMultiplier)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var trimmed = text.Trim();

        if (trimmed.EndsWith(" vnd"))
        {
            trimmed = trimmed[..^4].Trim();
        }

        decimal multiplier = sharedMultiplier;

        // Explicit suffix on this part overrides the shared multiplier.
        if (trimmed.EndsWith("trieu"))
        {
            multiplier = Million;
            trimmed = trimmed[..^5].Trim();
        }
        else if (trimmed.EndsWith("tr "))
        {
            multiplier = Million;
            trimmed = trimmed[..^3].Trim();
        }
        else if (trimmed.EndsWith("tr"))
        {
            multiplier = Million;
            trimmed = trimmed[..^2].Trim();
        }

        if (!decimal.TryParse(
                trimmed,
                NumberStyles.Any,
                CultureInfo.InvariantCulture,
                out var value))
        {
            return null;
        }

        if (value < 0)
        {
            return null;
        }

        return value * multiplier;
    }

    // Parse an amount expressed as "X", "X triệu", "X trieu", "X VND".
    private static decimal? ParseAmount(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var trimmed = text.Trim();

        // Strip trailing currency / unit words.
        var numericPart = trimmed;

        if (numericPart.EndsWith(" vnd"))
        {
            numericPart = numericPart[..^4].Trim();
        }

        var multiplier = 1m;

        if (numericPart.EndsWith("trieu"))
        {
            multiplier = Million;
            numericPart = numericPart[..^5].Trim();
        }
        else if (numericPart.EndsWith("tr"))
        {
            multiplier = Million;
            numericPart = numericPart[..^2].Trim();
        }
        else if (numericPart.EndsWith("tr "))
        {
            multiplier = Million;
            numericPart = numericPart[..^3].Trim();
        }

        if (!decimal.TryParse(
                numericPart,
                NumberStyles.Any,
                CultureInfo.InvariantCulture,
                out var value))
        {
            return null;
        }

        if (value < 0)
        {
            return null;
        }

        return value * multiplier;
    }

    // Validate a parsed budget range for internal consistency.
    public static bool IsValid(BudgetRange? range)
    {
        if (range is null)
        {
            return false;
        }

        if (range.MinVnd.HasValue && range.MinVnd.Value < 0)
        {
            return false;
        }

        if (range.MaxVnd.HasValue && range.MaxVnd.Value < 0)
        {
            return false;
        }

        if (range.MinVnd.HasValue && range.MaxVnd.HasValue && range.MinVnd.Value > range.MaxVnd.Value)
        {
            return false;
        }

        return true;
    }

    // Budget range compatibility in [0, 1].
    //
    // Each range is treated as a closed interval [lo, hi]:
    //   - point value          -> lo == hi
    //   - "Dưới X"             -> [0, X]
    //   - "Trên X"             -> [X, 2X] (open upper, estimated as 2x)
    //   - "X-Y"                -> [X, Y]
    //
    // Compatibility = length(intersection) / length(union).
    // Point/touching intersections receive a small base score (0.25);
    // disjoint intervals receive 0. Missing values receive 0.
    public static double Compatibility(BudgetRange? a, BudgetRange? b)
    {
        if (!IsValid(a) || !IsValid(b))
        {
            return 0d;
        }

        var aLo = a.MinVnd ?? 0m;
        var aHi = a.MaxVnd ?? Math.Max(aLo * 2m, 1m);
        var bLo = b.MinVnd ?? 0m;
        var bHi = b.MaxVnd ?? Math.Max(bLo * 2m, 1m);

        if (aLo > aHi) aHi = aLo;
        if (bLo > bHi) bHi = bLo;

        var overlapLo = Math.Max(aLo, bLo);
        var overlapHi = Math.Min(aHi, bHi);

        var unionLo = Math.Min(aLo, bLo);
        var unionHi = Math.Max(aHi, bHi);

        var unionWidth = (double)(unionHi - unionLo);

        // Identical single point.
        if (unionWidth <= 0d)
        {
            return 1d;
        }

        var overlapWidth = (double)(overlapHi - overlapLo);

        // Disjoint intervals.
        if (overlapWidth <= 0d)
        {
            // Intervals touch at a boundary (e.g. "Dưới 2M" vs "2-3M").
            var touches = overlapLo <= overlapHi + 1m;
            return touches ? 0.25d : 0d;
        }

        return Math.Clamp(overlapWidth / unionWidth, 0d, 1d);
    }
}
