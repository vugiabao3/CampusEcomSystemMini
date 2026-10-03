namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.UpdateReview;

public enum UpdateReviewOutcome
{
    Updated = 0,

    // Review không tồn tại.
    NotFound = 1,

    // Không phải người viết review.
    NotOwner = 2,

    // Thiếu Rating hoặc Rating không nằm trong khoảng 1–5.
    InvalidInput = 3,
}