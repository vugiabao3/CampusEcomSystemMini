namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.GetReviews;

// Một review trong danh sách.
//
// Chỉ trả thông tin hiển thị được (tên người viết),
// không trả PasswordHash hay dữ liệu nhạy cảm của User.
public sealed record GetReviewsResponse(
    Guid ReviewId,
    Guid DocumentId,
    Guid UserId,
    string FullName,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    DateTime UpdatedAt);