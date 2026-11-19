namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.CreateReview;

// Review vừa tạo, kèm điểm trung bình và số review
// mới nhất của tài liệu để frontend cập nhật luôn
// mà không cần gọi lại chi tiết tài liệu.
public sealed record CreateReviewResponse(
    Guid ReviewId,
    Guid DocumentId,
    string FullName,
    int Rating,
    string? Comment,
    int DocumentReviewCount,
    decimal DocumentRating,
    DateTime CreatedAt,
    DateTime UpdatedAt);