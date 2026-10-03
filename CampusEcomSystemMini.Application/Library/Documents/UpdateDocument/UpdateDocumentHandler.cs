using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.UpdateDocument;

public class UpdateDocumentHandler
    : IRequestHandler<UpdateDocumentCommand, UpdateDocumentResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateDocumentHandler(
        IDocumentRepository documentRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateDocumentResult> Handle(
        UpdateDocumentCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var document = await _documentRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (document is null)
        {
            return new UpdateDocumentResult(
                UpdateDocumentOutcome.NotFound,
                null,
                null);
        }

        // Không cho sửa tài liệu của người dùng khác.
        if (document.UserId != userId)
        {
            return new UpdateDocumentResult(
                UpdateDocumentOutcome.NotOwner,
                null,
                null);
        }

        var isPaid = string.Equals(
            document.PricingType,
            DocumentInput.PaidPricingType,
            StringComparison.OrdinalIgnoreCase);

        // Tài liệu miễn phí luôn có giá 0.
        var price = isPaid
            ? request.Price ?? document.Price
            : 0m;

        if (isPaid && price <= 0m)
        {
            return new UpdateDocumentResult(
                UpdateDocumentOutcome.InvalidInput,
                null,
                "Price must be greater than 0 for a paid document.");
        }

        document.Title = request.Title.Trim();
        document.Subject = request.Subject.Trim();
        document.Description = string.IsNullOrWhiteSpace(request.Description)
            ? null
            : request.Description.Trim();
        document.Price = price;
        document.UpdatedAt = DateTime.UtcNow;

        _documentRepository.UpdateAsync(
            document,
            cancellationToken);

        await _documentRepository.SaveChangesAsync(
            cancellationToken);

        return new UpdateDocumentResult(
            UpdateDocumentOutcome.Updated,
            new UpdateDocumentResponse(
                document.Id,
                document.UserId,
                document.Title,
                document.Subject,
                document.Description,
                DocumentInput.PricingTypeToLabel(document.PricingType),
                document.Price,
                document.FileName,
                document.FileType,
                document.FileSize,
                document.Rating,
                document.ReviewCount,
                document.CreatedAt,
                document.UpdatedAt),
            null);
    }
}