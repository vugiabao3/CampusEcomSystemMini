using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetDocumentById;

public class GetDocumentByIdHandler
    : IRequestHandler<GetDocumentByIdQuery, GetDocumentByIdResponse?>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserRepository _userRepository;

    public GetDocumentByIdHandler(
        IDocumentRepository documentRepository,
        IUserRepository userRepository)
    {
        _documentRepository = documentRepository;
        _userRepository = userRepository;
    }

    public async Task<GetDocumentByIdResponse?> Handle(
        GetDocumentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (document is null)
        {
            return null;
        }

        var uploader = await _userRepository.GetByIdAsync(
            document.UserId,
            cancellationToken);

        return new GetDocumentByIdResponse(
            document.Id,
            document.UserId,
            uploader?.FullName ?? string.Empty,
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
            document.UpdatedAt);
    }
}