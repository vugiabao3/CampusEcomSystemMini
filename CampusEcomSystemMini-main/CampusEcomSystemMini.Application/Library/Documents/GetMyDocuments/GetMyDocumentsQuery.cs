using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetMyDocuments;

// GET /api/library/documents/me
// UserId lấy từ ICurrentUserService, không nhận từ client.
public record GetMyDocumentsQuery : IRequest<List<GetMyDocumentsResponse>>;