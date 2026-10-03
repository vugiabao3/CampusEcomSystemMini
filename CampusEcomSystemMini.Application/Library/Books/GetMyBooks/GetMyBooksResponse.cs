namespace CampusEcomSystemMini.Application.Library.Books.GetMyBooks;

public record GetMyBooksResponse(
    Guid Id,
    Guid UserId,
    string FullName,
    string BookName,
    string WantedBookName,
    string Condition,
    string? Description,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
