using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

// Smart Matching của Module 2.
// Cosine Similarity chỉ được triển khai tại một nơi, không nhân bản
// trong từng Handler.
public interface IMatchingService
{
    // Dựng vector đặc trưng 4 chiều của candidate so với vector
    // nhu cầu của current user:
    // x1 = Habits / lifestyle
    // x2 = Goals
    // x3 = Geographic compatibility
    // x4 = Desired rental budget
    IReadOnlyList<double> BuildFeatureVector(
        Preference? currentUserPreferences,
        Preference? candidatePreferences);

    // Similarity(A, B) = (A · B) / (||A|| × ||B||)
    double CalculateCosineSimilarity(
        IReadOnlyList<double> vectorA,
        IReadOnlyList<double> vectorB);

    // MatchScore = Similarity × 100
    double CalculateMatchScore(
        Preference? currentUserPreferences,
        Preference? candidatePreferences);
}