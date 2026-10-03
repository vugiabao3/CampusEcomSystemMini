using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.CreateDocument;

public class CreateDocumentHandler
    : IRequestHandler<CreateDocumentCommand, CreateDocumentResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentStorage _documentStorage;
    private readonly IDocumentFileValidator _documentFileValidator;
    private readonly ICurrentUserService _currentUserService;

    public CreateDocumentHandler(
        IDocumentRepository documentRepository,
        IDocumentStorage documentStorage,
        IDocumentFileValidator documentFileValidator,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _documentStorage = documentStorage;
        _documentFileValidator = documentFileValidator;
        _currentUserService = currentUserService;
    }

    public async Task<CreateDocumentResult> Handle(
        CreateDocumentCommand request,
        CancellationToken cancellationToken)
    {
        // Người đăng tài liệu luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        if (!request.Pricing.HasValue)
        {
            return Invalid(
                "Pricing is required (Free or Paid).");
        }

        var pricing = request.Pricing.Value;

        var price = DocumentInput.NormalizePrice(pricing, request.Price);

        // Tài liệu trả phí phải có giá điểm,
        // nếu không thì download sẽ không bao giờ trừ điểm.
        if (pricing == DocumentPricingType.Paid && price <= 0m)
        {
            return Invalid(
                "Price must be greater than 0 for a paid document.");
        }

        if (request.File is null)
        {
            return Invalid(
                "A PDF or DOCX file is required.");
        }

        // Backend tự kiểm tra extension, kích thước,
        // file rỗng và nội dung thật của file.
        var validation = await _documentFileValidator.ValidateAsync(
            request.File,
            cancellationToken);

        if (!validation.IsValid || validation.FileType is null)
        {
            return new CreateDocumentResult(
                CreateDocumentOutcome.InvalidFile,
                null,
                validation.ErrorMessage);
        }

        // File gốc lưu ngoài database,
        // database chỉ giữ metadata và StoredFileName.
        var storedFileName = await _documentStorage.SaveAsync(
            request.File,
            cancellationToken);

        var now = DateTime.UtcNow;

        var document = new Document
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title.Trim(),
            Subject = request.Subject.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
            PricingType = DocumentInput.PricingTypeToString(pricing),
            Price = price,
            FileName = request.File.FileName,
            StoredFileName = storedFileName,
            FileType = validation.FileType,
            FileSize = request.File.Length,
            Rating = 0m,
            ReviewCount = 0,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _documentRepository.AddAsync(
            document,
            cancellationToken);

        try
        {
            await _documentRepository.SaveChangesAsync(
                cancellationToken);
        }
        catch
        {
            // Không để lại file rác khi lưu database thất bại.
            _documentStorage.Delete(storedFileName);

            throw;
        }

        return new CreateDocumentResult(
            CreateDocumentOutcome.Created,
            new CreateDocumentResponse(
                document.Id,
                document.UserId,
                document.Title,
                document.Subject,
                document.Description,
                document.PricingType,
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

    private static CreateDocumentResult Invalid(string errorMessage)
    {
        return new CreateDocumentResult(
            CreateDocumentOutcome.InvalidInput,
            null,
            errorMessage);
    }
}