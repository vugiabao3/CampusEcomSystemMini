using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.DeleteBook;

// DELETE /api/library/books/{id}
// Chỉ chủ bài đăng được xóa bài của mình.
public record DeleteBookCommand(
    Guid Id
) : IRequest<DeleteBookResult>;
