using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetDocumentById;

// GET /api/library/documents/{id}
public record GetDocumentByIdQuery(
    Guid Id
) : IRequest<GetDocumentByIdResponse?>;