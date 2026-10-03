using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.CreateReview;

// POST /api/library/documents/{id}/reviews
// UserId lấy từ JWT, không nhận từ client.
public record CreateReviewCommand(
    Guid DocumentId,
    int? Rating,
    string? Comment
) : IRequest<CreateReviewResult>;