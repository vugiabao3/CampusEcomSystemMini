using System.ComponentModel.DataAnnotations;

using CampusEcomSystemMini.Application.Library.Documents;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.CreateDocument;

// POST /api/library/documents  (multipart/form-data)
//
// Input:
//   Title
//   Subject
//   Description
//   Pricing  (Free | Paid)
//   Price    (chỉ dùng khi Pricing = Paid)
//   File     (PDF hoặc DOCX, tối đa 25MB)
//
// Không nhận UserId từ frontend để tránh ghi đè người đăng.
// Rating / ReviewCount không nhận từ frontend.
public record CreateDocumentCommand(
    [Required] string Title,
    [Required] string Subject,
    string? Description,
    DocumentPricingType? Pricing,
    decimal? Price,
    DocumentUpload? File
) : IRequest<CreateDocumentResult>;