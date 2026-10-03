namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.GetReviews;

public sealed record GetReviewsResult(
    GetReviewsOutcome Outcome,
    List<GetReviewsResponse>? Reviews,
    string? ErrorMessage)
{
    public static GetReviewsResult Found(
        List<GetReviewsResponse> reviews)
    {
        return new GetReviewsResult(
            GetReviewsOutcome.Success,
            reviews,
            null);
    }

    public static GetReviewsResult Failed(
        GetReviewsOutcome outcome,
        string errorMessage)
    {
        return new GetReviewsResult(
            outcome,
            null,
            errorMessage);
    }
}