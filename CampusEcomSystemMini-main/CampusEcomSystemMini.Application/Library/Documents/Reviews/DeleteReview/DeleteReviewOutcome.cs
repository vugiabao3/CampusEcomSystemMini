namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.DeleteReview;

public enum DeleteReviewOutcome
{
    Deleted = 0,

    // Review không tồn tại.
    NotFound = 1,

    // Không phải người viết review.
    NotOwner = 2,
}