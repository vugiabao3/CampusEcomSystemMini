using System.Text.RegularExpressions;

using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Infrastructure.Services;

// Cosine Similarity theo kiến trúc Module 2.
// Vector nhu cầu của người đang đăng nhập là điểm tham chiếu,
// mỗi chiều của vector candidate là mức độ tương đồng ở chiều đó.
public class MatchingService : IMatchingService
{
    // A = [x1, x2, x3, x4] của current user = [1, 1, 1, 1]
    private static readonly double[] ReferenceVector =
    [
        1d,
        1d,
        1d,
        1d
    ];

    private static readonly Regex WordSeparatorPattern = new(
        @"[^\p{L}\p{N}]+",
        RegexOptions.Compiled);

    public IReadOnlyList<double> BuildFeatureVector(
        Preference? currentUserPreferences,
        Preference? candidatePreferences)
    {
        // x1 = Habits / lifestyle
        // x2 = Goals
        // x3 = Geographic compatibility
        // x4 = Desired rental budget
        return
        [
            CalculateTextSimilarity(
                currentUserPreferences?.Habits,
                candidatePreferences?.Habits),

            CalculateTextSimilarity(
                currentUserPreferences?.Goals,
                candidatePreferences?.Goals),

            CalculateTextSimilarity(
                currentUserPreferences?.PreferredRentalArea,
                candidatePreferences?.PreferredRentalArea),

            CalculateBudgetSimilarity(
                currentUserPreferences?.MonthlyRentalBudget,
                candidatePreferences?.MonthlyRentalBudget)
        ];
    }

    public double CalculateCosineSimilarity(
        IReadOnlyList<double> vectorA,
        IReadOnlyList<double> vectorB)
    {
        if (vectorA is null ||
            vectorB is null ||
            vectorA.Count == 0 ||
            vectorA.Count != vectorB.Count)
        {
            return 0d;
        }

        double dotProduct = 0d;

        double magnitudeA = 0d;

        double magnitudeB = 0d;

        for (int index = 0; index < vectorA.Count; index++)
        {
            dotProduct += vectorA[index] * vectorB[index];

            magnitudeA += vectorA[index] * vectorA[index];

            magnitudeB += vectorB[index] * vectorB[index];
        }

        // Zero-vector safety: không được chia cho 0.
        if (magnitudeA <= 0d || magnitudeB <= 0d)
        {
            return 0d;
        }

        var similarity = dotProduct /
            (Math.Sqrt(magnitudeA) * Math.Sqrt(magnitudeB));

        return Math.Clamp(similarity, 0d, 1d);
    }

    public double CalculateMatchScore(
        Preference? currentUserPreferences,
        Preference? candidatePreferences)
    {
        var candidateVector = BuildFeatureVector(
            currentUserPreferences,
            candidatePreferences);

        var similarity = CalculateCosineSimilarity(
            ReferenceVector,
            candidateVector);

        return Math.Round(similarity * 100d, 2);
    }

    // So khớp từ khoá giữa hai chuỗi nhu cầu, trả về [0, 1].
    private static double CalculateTextSimilarity(
        string? valueA,
        string? valueB)
    {
        var tokensA = Tokenize(valueA);

        var tokensB = Tokenize(valueB);

        if (tokensA.Count == 0 || tokensB.Count == 0)
        {
            return 0d;
        }

        var intersection = 0;

        foreach (var token in tokensA)
        {
            if (tokensB.Contains(token))
            {
                intersection++;
            }
        }

        var union = tokensA.Count + tokensB.Count - intersection;

        if (union == 0)
        {
            return 0d;
        }

        return (double)intersection / union;
    }

    // Ngân sách gần nhau thì chiều budget càng cao, trả về [0, 1].
    private static double CalculateBudgetSimilarity(
        decimal? budgetA,
        decimal? budgetB)
    {
        if (!budgetA.HasValue || !budgetB.HasValue)
        {
            return 0d;
        }

        if (budgetA.Value <= 0m || budgetB.Value <= 0m)
        {
            return 0d;
        }

        var maxBudget = Math.Max(budgetA.Value, budgetB.Value);

        var difference = Math.Abs(budgetA.Value - budgetB.Value);

        return Math.Max(
            0d,
            1d - (double)(difference / maxBudget));
    }

    private static HashSet<string> Tokenize(string? value)
    {
        var tokens = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(value))
        {
            return tokens;
        }

        foreach (var token in WordSeparatorPattern.Split(value))
        {
            var normalized = token.Trim();

            if (normalized.Length > 0)
            {
                tokens.Add(normalized.ToLowerInvariant());
            }
        }

        return tokens;
    }
}