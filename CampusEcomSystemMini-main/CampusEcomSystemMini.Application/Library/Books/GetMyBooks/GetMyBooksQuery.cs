using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetMyBooks;

// GET /api/library/books/me
// UserId lấy từ ICurrentUserService, không nhận từ client.
public record GetMyBooksQuery : IRequest<List<GetMyBooksResponse>>;
