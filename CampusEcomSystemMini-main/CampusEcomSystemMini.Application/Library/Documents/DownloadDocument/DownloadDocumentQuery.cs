using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;

// GET /api/library/documents/{id}/download
public record DownloadDocumentQuery(
    Guid Id
) : IRequest<DownloadDocumentResult>;
