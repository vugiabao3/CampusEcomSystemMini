using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.UpdateReview;

// PUT /api/library/reviews/{reviewId}
// Không có UserId trong input: Backend kiểm tra người tạo review.
public record UpdateReviewCommand(
    Guid Id,
    int? Rating,
    string? Comment
) : IRequest<UpdateReviewResult>;