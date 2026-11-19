using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.GetDocuments;

// GET /api/library/documents?search=...&subject=...&pricing=...
// Cả ba tham số đều không bắt buộc.
// Danh sách này không trả file gốc và không trả StoredFileName.
public record GetDocumentsQuery(
    string? Search,
    string? Subject,
    DocumentPricingType? Pricing
) : IRequest<List<GetDocumentsResponse>>;