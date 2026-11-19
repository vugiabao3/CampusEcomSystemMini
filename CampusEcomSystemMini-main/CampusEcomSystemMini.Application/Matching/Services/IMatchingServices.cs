namespace CampusEcomSystemMini.Application.Matching.Services;

using CampusEcomSystemMini.Application.Matching.Encoding;

// Result of a domain-specific match computation.
public record MatchResult(
    double Score,           // 0-1 similarity (not percentage)
    double Coverage,        // fraction of comparable criteria [0,1]
    int FilledCriteria,
    IReadOnlyList<string> MatchedCriteria,
    IReadOnlyList<string> UnmatchedCriteria);

// Study-group matching service.
// Encodes current user + candidate study preferences, computes cosine
// similarity and coverage. Never touches roommate criteria.
public interface IStudyMatchingService
{
    MatchResult Compute(StudyPreferences? current, StudyPreferences? candidate);
}

// Roommate matching service.
// Encodes current user + candidate roommate preferences, computes cosine
// similarity over non-budget criteria plus budget range compatibility.
// Never touches study-group criteria.
public interface IRoomMatchingService
{
    MatchResult Compute(RoomPreferences? current, RoomPreferences? candidate);
}
