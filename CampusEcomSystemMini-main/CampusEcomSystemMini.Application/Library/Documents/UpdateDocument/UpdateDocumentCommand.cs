using System.ComponentModel.DataAnnotations;

using CampusEcomSystemMini.Application.Library.Documents;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.UpdateDocument;

// PUT /api/library/documents/{id}
//
// Chỉ sửa metadata: Title, Subject, Description, Price.
// Workflow chưa yêu cầu thay file gốc nên API này không nhận File.
// Chỉ chủ tài liệu được sửa tài liệu của mình.
// PricingType không đổi ở batch này.
public record UpdateDocumentCommand(
    [Required] string Title,
    [Required] string Subject,
    string? Description,
    decimal? Price
) : IRequest<UpdateDocumentResult>
{
    // Id lấy từ route, không nhận từ body.
    public Guid Id { get; init; }
}