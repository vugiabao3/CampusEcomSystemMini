namespace CampusEcomSystemMini.Application.Matching.Services;

using CampusEcomSystemMini.Application.Matching.Encoding;
using CampusEcomSystemMini.Application.Matching.Similarity;

// Study-group matching: cosine similarity over encoded study preferences
// plus coverage. Never considers roommate criteria.
public class StudyMatchingService : IStudyMatchingService
{
    private readonly IStudyFeatureEncoder _encoder;
    private readonly ICosineSimilarityCalculator _cosine;

    // Minimum fraction of comparable criteria required for a confident match.
    // Below this, the score is still returned but callers should treat it
    // as low-confidence.
    private const double MinConfidenceCoverage = 0.25d;

    public StudyMatchingService(
        IStudyFeatureEncoder encoder,
        ICosineSimilarityCalculator cosine)
    {
        _encoder = encoder;
        _cosine = cosine;
    }

    public MatchResult Compute(StudyPreferences? current, StudyPreferences? candidate)
    {
        var currentEncoded = _encoder.Encode(current);
        var candidateEncoded = _encoder.Encode(candidate);

        var cosine = _cosine.Calculate(currentEncoded.Features, candidateEncoded.Features);

        // Combined coverage: average of both users' coverage. A match is only
        // confident when both sides have provided usable information.
        var coverage = (currentEncoded.Coverage + candidateEncoded.Coverage) / 2d;

        var matched = new List<string>();
        var unmatched = new List<string>();

        EvaluateCriterion(current?.Subjects, candidate?.Subjects,
            "Môn học", matched, unmatched);
        EvaluateCriterion(current?.Languages, candidate?.Languages,
            "Ngôn ngữ lập trình", matched, unmatched);
        EvaluateScalar(current?.Goal, candidate?.Goal, "Mục tiêu", matched, unmatched);
        EvaluateScalar(current?.Proficiency, candidate?.Proficiency, "Trình độ", matched, unmatched);
        EvaluateScalar(current?.StudyTime, candidate?.StudyTime, "Thời gian học", matched, unmatched);
        EvaluateScalar(current?.Format, candidate?.Format, "Hình thức học", matched, unmatched);
        EvaluateScalar(current?.Method, candidate?.Method, "Phương pháp học", matched, unmatched);
        EvaluateScalar(current?.Frequency, candidate?.Frequency, "Tần suất học", matched, unmatched);

        var score = cosine;

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
            // Both missing -> not counted as matched or unmatched.
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
}
