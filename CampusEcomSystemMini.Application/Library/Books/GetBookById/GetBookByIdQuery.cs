using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetBookById;

// GET /api/library/books/{id}
public record GetBookByIdQuery(
    Guid Id
) : IRequest<GetBookByIdResponse?>;
