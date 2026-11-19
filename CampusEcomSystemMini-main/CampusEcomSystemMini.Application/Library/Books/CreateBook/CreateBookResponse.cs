namespace CampusEcomSystemMini.Application.Library.Books.CreateBook;

public record CreateBookResponse(
    Guid Id,
    Guid UserId,
    string BookName,
    string WantedBookName,
    string Condition,
    string? Description,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
