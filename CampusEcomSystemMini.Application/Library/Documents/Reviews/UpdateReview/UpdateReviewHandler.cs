using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.UpdateReview;

// Sửa review — MODULE 4 / BATCH 4 (REVIEWS).
// Chỉ người viết review được sửa.
public class UpdateReviewHandler
    : IRequestHandler<UpdateReviewCommand, UpdateReviewResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentReviewRepository _reviewRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateReviewHandler(
        IDocumentRepository documentRepository,
        IDocumentReviewRepository reviewRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _reviewRepository = reviewRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateReviewResult> Handle(
        UpdateReviewCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var review = await _reviewRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (review is null)
        {
            return UpdateReviewResult.Failed(
                UpdateReviewOutcome.NotFound,
                "Review not found.");
        }

        if (review.UserId != userId)
        {
            return UpdateReviewResult.Failed(
                UpdateReviewOutcome.NotOwner,
                "Bạn không phải người viết review này.");
        }

        var rating = DocumentReviewInput.NormalizeRating(request.Rating);

        if (rating is null)
        {
            return UpdateReviewResult.Failed(
                UpdateReviewOutcome.InvalidInput,
                "Rating must be between 1 and 5.");
        }

        review.Rating = rating.Value;

        review.Comment = DocumentReviewInput.NormalizeComment(
            request.Comment);

        review.UpdatedAt = DateTime.UtcNow;

        _reviewRepository.UpdateAsync(
            review,
            cancellationToken);

        // Review phải nằm trong database trước khi tính lại
        // điểm trung bình, vì điểm trung bình được tính
        // từ danh sách review trong database.
        await _reviewRepository.SaveChangesAsync(
            cancellationToken);

        var document = await _documentRepository.GetByIdAsync(
            review.DocumentId,
            cancellationToken);

        // Sửa review làm thay đổi điểm trung bình của tài liệu.
        if (document is not null)
        {
            await DocumentReviewAggregator.ApplyAsync(
                document,
                _documentRepository,
                _reviewRepository,
                cancellationToken);
        }

        await _documentRepository.SaveChangesAsync(
            cancellationToken);

        return UpdateReviewResult.Updated(
            new UpdateReviewResponse(
                review.Id,
                review.DocumentId,
                review.Rating,
                review.Comment,
                document?.ReviewCount ?? 0,
                document?.Rating ?? 0m,
                review.CreatedAt,
                review.UpdatedAt));
    }
}