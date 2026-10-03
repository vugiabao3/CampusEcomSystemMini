namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.CreateReview;

public enum CreateReviewOutcome
{
    Created = 0,

    // Tài liệu không tồn tại.
    NotFound = 1,

    // Thiếu Rating hoặc Rating không nằm trong khoảng 1–5.
    InvalidInput = 2,

    // Người dùng đã đánh giá tài liệu này rồi.
    AlreadyReviewed = 3,
}