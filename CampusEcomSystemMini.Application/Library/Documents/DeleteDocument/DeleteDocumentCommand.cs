using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.DeleteDocument;

// DELETE /api/library/documents/{id}
// Chỉ chủ tài liệu được xóa tài liệu của mình.
public record DeleteDocumentCommand(
    Guid Id
) : IRequest<DeleteDocumentResult>;