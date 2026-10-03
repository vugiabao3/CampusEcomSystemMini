using System.ComponentModel.DataAnnotations;

using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.UpdateBook;

// PUT /api/library/books/{id}
// Chỉ chủ bài đăng được sửa bài của mình.
// Status do Backend quản lý, không cho sửa qua API này.
public record UpdateBookCommand(
    [Required] string BookName,
    [Required] string WantedBookName,
    [Required] string Condition,
    string? Description
) : IRequest<UpdateBookResult>
{
    // Id lấy từ route, không nhận từ body.
    public Guid Id { get; init; }
}
