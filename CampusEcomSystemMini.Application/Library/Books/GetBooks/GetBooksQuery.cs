using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetBooks;

// GET /api/library/books?search=...&status=...
// Hai tham số đều không bắt buộc,
// search khớp vào tên sách đang có hoặc tên sách đang tìm.
public record GetBooksQuery(
    string? Search,
    string? Status
) : IRequest<List<GetBooksResponse>>;
