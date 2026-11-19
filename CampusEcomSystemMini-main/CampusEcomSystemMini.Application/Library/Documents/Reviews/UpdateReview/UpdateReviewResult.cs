namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.UpdateReview;

public sealed record UpdateReviewResult(
    UpdateReviewOutcome Outcome,
    UpdateReviewResponse? Response,
    string? ErrorMessage)
{
    public static UpdateReviewResult Updated(
        UpdateReviewResponse response)
    {
        return new UpdateReviewResult(
            UpdateReviewOutcome.Updated,
            response,
            null);
    }

    public static UpdateReviewResult Failed(
        UpdateReviewOutcome outcome,
        string errorMessage)
    {
        return new UpdateReviewResult(
            outcome,
            null,
            errorMessage);
    }
}