namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.UpdateReview;

// Review sau khi sửa, kèm điểm trung bình và số review
// mới nhất của tài liệu.
public sealed record UpdateReviewResponse(
    Guid ReviewId,
    Guid DocumentId,
    int Rating,
    string? Comment,
    int DocumentReviewCount,
    decimal DocumentRating,
    DateTime CreatedAt,
    DateTime UpdatedAt);