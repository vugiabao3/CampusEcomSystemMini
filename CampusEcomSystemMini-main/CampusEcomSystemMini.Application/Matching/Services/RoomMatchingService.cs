namespace CampusEcomSystemMini.Application.Matching.Services;

using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Normalization;
using CampusEcomSystemMini.Application.Matching.Similarity;

// Roommate matching: cosine similarity over non-budget criteria plus an
// explicit budget range-compatibility component. Never considers
// study-group criteria.
public class RoomMatchingService : IRoomMatchingService
{
    private readonly IRoomFeatureEncoder _encoder;
    private readonly ICosineSimilarityCalculator _cosine;

    // Weight of budget within the 8 roommate criteria (1 of 8).
    private const double BudgetWeight = 0.125d;
    private const double FeatureWeight = 1d - BudgetWeight;

    public RoomMatchingService(
        IRoomFeatureEncoder encoder,
        ICosineSimilarityCalculator cosine)
    {
        _encoder = encoder;
        _cosine = cosine;
    }

    public MatchResult Compute(RoomPreferences? current, RoomPreferences? candidate)
    {
        var currentEncoded = _encoder.Encode(current);
        var candidateEncoded = _encoder.Encode(candidate);

        // Cosine over non-budget criteria (area, type, sleep, cleanliness,
        // noise, cooking, amenities).
        var cosine = _cosine.Calculate(currentEncoded.Features, candidateEncoded.Features);

        // Explicit budget range compatibility.
        var budgetCompat = BudgetParser.Compatibility(
            currentEncoded.Budget,
            candidateEncoded.Budget);

        // Blend: non-budget features carry 7/8, budget carries 1/8.
        var score = FeatureWeight * cosine + BudgetWeight * budgetCompat;

        var coverage = (currentEncoded.Coverage + candidateEncoded.Coverage) / 2d;

        var matched = new List<string>();
        var unmatched = new List<string>();

        EvaluateScalar(current?.Area, candidate?.Area, "Khu vực", matched, unmatched);
        EvaluateBudget(currentEncoded.Budget, candidateEncoded.Budget, matched, unmatched);
        EvaluateScalar(current?.RoomType, candidate?.RoomType, "Loại phòng", matched, unmatched);
        EvaluateScalar(current?.SleepSchedule, candidate?.SleepSchedule, "Giờ ngủ", matched, unmatched);
        EvaluateScalar(current?.Cleanliness, candidate?.Cleanliness, "Mức độ sạch sẽ", matched, unmatched);
        EvaluateScalar(current?.NoisePreference, candidate?.NoisePreference, "Tiếng ồn", matched, unmatched);
        EvaluateScalar(current?.CookingHabits, candidate?.CookingHabits, "Nấu ăn", matched, unmatched);
        EvaluateCriterion(current?.Amenities, candidate?.Amenities, "Tiện ích", matched, unmatched);

        return new MatchResult(
            score,
            coverage,
            Math.Max(currentEncoded.FilledCriteria, candidateEncoded.FilledCriteria),
            matched,
            unmatched);
    }

    private static void EvaluateCriterion(
        IReadOnlyList<string>? a,
        IReadOnlyList<string>? b,
        string name,
        List<string> matched,
        List<string> unmatched)
    {
        var aSet = new HashSet<string>(a ?? [], StringComparer.OrdinalIgnoreCase);
        var bSet = new HashSet<string>(b ?? [], StringComparer.OrdinalIgnoreCase);

        if (aSet.Count == 0 && bSet.Count == 0)
        {
            return;
        }

        var intersect = aSet.Intersect(bSet, StringComparer.OrdinalIgnoreCase).ToList();

        if (intersect.Count > 0)
        {
            matched.Add($"{name} ({string.Join(", ", intersect)})");
        }
        else
        {
            unmatched.Add(name);
        }
    }

    private static void EvaluateScalar(
        string? a,
        string? b,
        string name,
        List<string> matched,
        List<string> unmatched)
    {
        var aMissing = string.IsNullOrWhiteSpace(a);
        var bMissing = string.IsNullOrWhiteSpace(b);

        if (aMissing && bMissing)
        {
            return;
        }

        if (!aMissing && !bMissing &&
            string.Equals(a.Trim(), b.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            matched.Add(name);
        }
        else
        {
            unmatched.Add(name);
        }
    }

    private static void EvaluateBudget(
        BudgetRange? a,
        BudgetRange? b,
        List<string> matched,
        List<string> unmatched)
    {
        if (!BudgetParser.IsValid(a) && !BudgetParser.IsValid(b))
        {
            return;
        }

        var compat = BudgetParser.Compatibility(a, b);

        if (compat >= 0.5d)
        {
            matched.Add($"Ngân sách (tương thích {compat:P0})");
        }
        else
        {
            unmatched.Add("Ngân sách");
        }
    }
}
