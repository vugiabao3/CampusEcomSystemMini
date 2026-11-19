using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews.GetReviews;

public class GetReviewsHandler
    : IRequestHandler<GetReviewsQuery, GetReviewsResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentReviewRepository _reviewRepository;
    private readonly IUserRepository _userRepository;

    public GetReviewsHandler(
        IDocumentRepository documentRepository,
        IDocumentReviewRepository reviewRepository,
        IUserRepository userRepository)
    {
        _documentRepository = documentRepository;
        _reviewRepository = reviewRepository;
        _userRepository = userRepository;
    }

    public async Task<GetReviewsResult> Handle(
        GetReviewsQuery request,
        CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(
            request.DocumentId,
            cancellationToken);

        if (document is null)
        {
            return GetReviewsResult.Failed(
                GetReviewsOutcome.NotFound,
                "Document not found.");
        }

        var reviews = await _reviewRepository.GetByDocumentIdAsync(
            document.Id,
            cancellationToken);

        var responses = new List<GetReviewsResponse>(
            reviews.Count);

        if (reviews.Count == 0)
        {
            return GetReviewsResult.Found(responses);
        }

        // Danh sách người viết review được lấy một lần
        // thay vì gọi cho từng review.
        var users = await _userRepository.GetAllAsync(
            cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        foreach (var review in reviews)
        {
            userById.TryGetValue(review.UserId, out var reviewer);

            responses.Add(
                new GetReviewsResponse(
                    review.Id,
                    review.DocumentId,
                    review.UserId,
                    reviewer?.FullName ?? string.Empty,
                    review.Rating,
                    review.Comment,
                    review.CreatedAt,
                    review.UpdatedAt));
        }

        return GetReviewsResult.Found(responses);
    }
}