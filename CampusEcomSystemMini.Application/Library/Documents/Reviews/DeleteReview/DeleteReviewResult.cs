namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.DeleteReview;

public sealed record DeleteReviewResult(
    DeleteReviewOutcome Outcome,
    DeleteReviewResponse? Response,
    string? ErrorMessage)
{
    public static DeleteReviewResult Deleted(
        DeleteReviewResponse response)
    {
        return new DeleteReviewResult(
            DeleteReviewOutcome.Deleted,
            response,
            null);
    }

    public static DeleteReviewResult Failed(
        DeleteReviewOutcome outcome,
        string errorMessage)
    {
        return new DeleteReviewResult(
            outcome,
            null,
            errorMessage);
    }
}