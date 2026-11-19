using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.DeleteReview;

// DELETE /api/library/reviews/{reviewId}
public record DeleteReviewCommand(
    Guid Id
) : IRequest<DeleteReviewResult>;