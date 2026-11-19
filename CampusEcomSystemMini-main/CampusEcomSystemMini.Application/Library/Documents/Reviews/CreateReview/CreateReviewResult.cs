namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.CreateReview;

public sealed record CreateReviewResult(
    CreateReviewOutcome Outcome,
    CreateReviewResponse? Response,
    string? ErrorMessage)
{
    public static CreateReviewResult Created(
        CreateReviewResponse response)
    {
        return new CreateReviewResult(
            CreateReviewOutcome.Created,
            response,
            null);
    }

    public static CreateReviewResult Failed(
        CreateReviewOutcome outcome,
        string errorMessage)
    {
        return new CreateReviewResult(
            outcome,
            null,
            errorMessage);
    }
}