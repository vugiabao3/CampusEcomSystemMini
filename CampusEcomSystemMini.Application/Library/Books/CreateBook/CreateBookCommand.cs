using System.ComponentModel.DataAnnotations;

using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.CreateBook;

// POST /api/library/books
// Không nhận UserId từ frontend để tránh ghi đè chủ bài đăng.
// Status do Backend khởi tạo, không nhận từ frontend.
public record CreateBookCommand(
    [Required] string BookName,
    [Required] string WantedBookName,
    [Required] string Condition,
    string? Description
) : IRequest<CreateBookResponse>;
