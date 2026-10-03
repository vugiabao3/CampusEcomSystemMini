using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetMyDocuments;

public class GetMyDocumentsHandler
    : IRequestHandler<GetMyDocumentsQuery, List<GetMyDocumentsResponse>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyDocumentsHandler(
        IDocumentRepository documentRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetMyDocumentsResponse>> Handle(
        GetMyDocumentsQuery request,
        CancellationToken cancellationToken)
    {
        // Người đăng tài liệu luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        var documents = await _documentRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        if (documents.Count == 0)
        {
            return [];
        }

        var uploader = await _userRepository.GetByIdAsync(
            userId,
            cancellationToken);

        var fullName = uploader?.FullName ?? string.Empty;

        return documents
            .Select(document => new GetMyDocumentsResponse(
                document.Id,
                document.UserId,
                fullName,
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
                document.UpdatedAt))
            .ToList();
    }
}