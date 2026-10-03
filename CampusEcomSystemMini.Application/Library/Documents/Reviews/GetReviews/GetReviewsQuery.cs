using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.GetReviews;

// GET /api/library/documents/{id}/reviews
public record GetReviewsQuery(
    Guid DocumentId
) : IRequest<GetReviewsResult>;