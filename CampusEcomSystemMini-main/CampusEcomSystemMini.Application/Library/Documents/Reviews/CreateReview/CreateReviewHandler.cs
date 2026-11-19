using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.CreateReview;

// Tạo review cho tài liệu — MODULE 4 / BATCH 4 (REVIEWS).
//
// Mỗi người dùng chỉ đánh giá một tài liệu đúng một lần,
// nếu đánh giá rồi thì sửa review đã có thay vì tạo mới.
public class CreateReviewHandler
    : IRequestHandler<CreateReviewCommand, CreateReviewResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentReviewRepository _reviewRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateReviewHandler(
        IDocumentRepository documentRepository,
        IDocumentReviewRepository reviewRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _reviewRepository = reviewRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreateReviewResult> Handle(
        CreateReviewCommand request,
        CancellationToken cancellationToken)
    {
        // Người viết review luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        var document = await _documentRepository.GetByIdAsync(
            request.DocumentId,
            cancellationToken);

        if (document is null)
        {
            return CreateReviewResult.Failed(
                CreateReviewOutcome.NotFound,
                "Document not found.");
        }

        var rating = DocumentReviewInput.NormalizeRating(request.Rating);

        if (rating is null)
        {
            return CreateReviewResult.Failed(
                CreateReviewOutcome.InvalidInput,
                "Rating must be between 1 and 5.");
        }

        var existing = await _reviewRepository.GetByUserAndDocumentAsync(
            userId,
            document.Id,
            cancellationToken);

        if (existing is not null)
        {
            return CreateReviewResult.Failed(
                CreateReviewOutcome.AlreadyReviewed,
                "Bạn đã đánh giá tài liệu này rồi, hãy sửa review của bạn.");
        }

        var now = DateTime.UtcNow;

        var review = new DocumentReview
        {
            Id = Guid.NewGuid(),
            DocumentId = document.Id,
            UserId = userId,
            Rating = rating.Value,
            Comment = DocumentReviewInput.NormalizeComment(
                request.Comment),
            CreatedAt = now,
            UpdatedAt = now
        };

        await _reviewRepository.AddAsync(
            review,
            cancellationToken);

        // Review phải nằm trong database trước khi tính lại
        // điểm trung bình, vì điểm trung bình được tính
        // từ danh sách review trong database.
        await _reviewRepository.SaveChangesAsync(
            cancellationToken);

        // Điểm trung bình của tài liệu thay đổi theo review mới,
        // tính sau khi review đã nằm trong database.
        await DocumentReviewAggregator.ApplyAsync(
            document,
            _documentRepository,
            _reviewRepository,
            cancellationToken);

        await _documentRepository.SaveChangesAsync(
            cancellationToken);

        var reviewer = await _userRepository.GetByIdAsync(
            userId,
            cancellationToken);

        return CreateReviewResult.Created(
            new CreateReviewResponse(
                review.Id,
                review.DocumentId,
                reviewer?.FullName ?? string.Empty,
                review.Rating,
                review.Comment,
                document.ReviewCount,
                document.Rating,
                review.CreatedAt,
                review.UpdatedAt));
    }
}