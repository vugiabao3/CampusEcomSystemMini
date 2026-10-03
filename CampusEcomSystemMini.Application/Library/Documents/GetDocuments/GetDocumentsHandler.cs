using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetDocuments;

public class GetDocumentsHandler
    : IRequestHandler<GetDocumentsQuery, List<GetDocumentsResponse>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserRepository _userRepository;

    public GetDocumentsHandler(
        IDocumentRepository documentRepository,
        IUserRepository userRepository)
    {
        _documentRepository = documentRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GetDocumentsResponse>> Handle(
        GetDocumentsQuery request,
        CancellationToken cancellationToken)
    {
        var search = DocumentInput.NormalizeSearch(request.Search);

        var subject = DocumentInput.NormalizeSubject(request.Subject);

        // Bộ lọc được áp dụng ngay trong truy vấn database.
        var pricing = request.Pricing.HasValue
            ? DocumentInput.PricingTypeToString(request.Pricing.Value)
            : null;

        var documents = await _documentRepository.GetAllAsync(
            search,
            subject,
            pricing,
            cancellationToken);

        if (documents.Count == 0)
        {
            return [];
        }

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetDocumentsResponse>();

        foreach (var document in documents)
        {
            userById.TryGetValue(document.UserId, out var uploader);

            result.Add(
                new GetDocumentsResponse(
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
                    document.UpdatedAt));
        }

        return result;
    }
}