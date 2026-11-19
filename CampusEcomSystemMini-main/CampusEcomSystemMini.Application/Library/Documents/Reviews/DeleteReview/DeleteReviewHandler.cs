using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.DeleteReview;

// Xóa review — MODULE 4 / BATCH 4 (REVIEWS).
// Chỉ người viết review được xóa.
// Admin moderation thuộc Module 6, batch này không thêm.
public class DeleteReviewHandler
    : IRequestHandler<DeleteReviewCommand, DeleteReviewResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentReviewRepository _reviewRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteReviewHandler(
        IDocumentRepository documentRepository,
        IDocumentReviewRepository reviewRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _reviewRepository = reviewRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteReviewResult> Handle(
        DeleteReviewCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var review = await _reviewRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (review is null)
        {
            return DeleteReviewResult.Failed(
                DeleteReviewOutcome.NotFound,
                "Review not found.");
        }

        if (review.UserId != userId)
        {
            return DeleteReviewResult.Failed(
                DeleteReviewOutcome.NotOwner,
                "Bạn không phải người viết review này.");
        }

        var document = await _documentRepository.GetByIdAsync(
            review.DocumentId,
            cancellationToken);

        _reviewRepository.Remove(review);

        // Xóa review trước rồi mới tính lại điểm trung bình,
        // vì điểm trung bình được tính từ danh sách review
        // còn lại trong database.
        await _reviewRepository.SaveChangesAsync(
            cancellationToken);

        // Xóa review làm thay đổi điểm trung bình của tài liệu.
        if (document is not null)
        {
            await DocumentReviewAggregator.ApplyAsync(
                document,
                _documentRepository,
                _reviewRepository,
                cancellationToken);

            await _documentRepository.SaveChangesAsync(
                cancellationToken);
        }

        return DeleteReviewResult.Deleted(
            new DeleteReviewResponse(
                true,
                "Review deleted successfully."));
    }
}