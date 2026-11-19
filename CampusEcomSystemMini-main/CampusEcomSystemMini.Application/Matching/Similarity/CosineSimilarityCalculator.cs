namespace CampusEcomSystemMini.Application.Matching.Similarity;

// Cosine similarity: cos(A, B) = (A · B) / (||A|| × ||B||).
//
// Pure mathematical calculator — no domain knowledge. Returns 0 for
// null, empty, mismatched-dimension, or zero-magnitude vectors to avoid
// division by zero. Results are clamped to [0, 1] and are NOT rounded
// here (rounding is a display concern).
public interface ICosineSimilarityCalculator
{
    double Calculate(double[]? vectorA, double[]? vectorB);
}

public class CosineSimilarityCalculator : ICosineSimilarityCalculator
{
    public double Calculate(double[]? vectorA, double[]? vectorB)
    {
        if (vectorA is null || vectorB is null ||
            vectorA.Length == 0 || vectorA.Length != vectorB.Length)
        {
            return 0d;
        }

        double dotProduct = 0d;
        double magnitudeA = 0d;
        double magnitudeB = 0d;

        for (var i = 0; i < vectorA.Length; i++)
        {
            var a = vectorA[i];
            var b = vectorB[i];

            dotProduct += a * b;
            magnitudeA += a * a;
            magnitudeB += b * b;
        }

        if (magnitudeA <= 0d || magnitudeB <= 0d)
        {
            return 0d;
        }

        var similarity = dotProduct / (Math.Sqrt(magnitudeA) * Math.Sqrt(magnitudeB));

        return Math.Clamp(similarity, 0d, 1d);
    }
}
