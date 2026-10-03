using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.DeleteDocument;

public class DeleteDocumentHandler
    : IRequestHandler<DeleteDocumentCommand, DeleteDocumentResult>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentStorage _documentStorage;
    private readonly ICurrentUserService _currentUserService;

    public DeleteDocumentHandler(
        IDocumentRepository documentRepository,
        IDocumentStorage documentStorage,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _documentStorage = documentStorage;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteDocumentResult> Handle(
        DeleteDocumentCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var document = await _documentRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (document is null)
        {
            return new DeleteDocumentResult(
                DeleteDocumentOutcome.NotFound,
                null);
        }

        // Không cho xóa tài liệu của người dùng khác.
        if (document.UserId != userId)
        {
            return new DeleteDocumentResult(
                DeleteDocumentOutcome.NotOwner,
                null);
        }

        _documentRepository.Remove(document);

        await _documentRepository.SaveChangesAsync(
            cancellationToken);

        // File gốc nằm ngoài database nên phải xóa riêng,
        // không xóa file của người dùng khác.
        _documentStorage.Delete(document.StoredFileName);

        return new DeleteDocumentResult(
            DeleteDocumentOutcome.Deleted,
            new DeleteDocumentResponse(
                true,
                "Document deleted successfully."));
    }
}