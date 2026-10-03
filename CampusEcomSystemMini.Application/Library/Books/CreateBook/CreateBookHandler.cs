using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.CreateBook;

public class CreateBookHandler
    : IRequestHandler<CreateBookCommand, CreateBookResponse>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateBookHandler(
        IBookExchangeRepository bookExchangeRepository,
        ICurrentUserService currentUserService)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreateBookResponse> Handle(
        CreateBookCommand request,
        CancellationToken cancellationToken)
    {
        // Chủ bài đăng luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        var now = DateTime.UtcNow;

        var post = new BookExchangePost
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BookName = request.BookName.Trim(),
            WantedBookName = request.WantedBookName.Trim(),
            Condition = request.Condition.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
            Status = BookInput.OpenStatus,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _bookExchangeRepository.AddAsync(
            post,
            cancellationToken);

        await _bookExchangeRepository.SaveChangesAsync(
            cancellationToken);

        return new CreateBookResponse(
            post.Id,
            post.UserId,
            post.BookName,
            post.WantedBookName,
            post.Condition,
            post.Description,
            post.Status,
            post.CreatedAt,
            post.UpdatedAt);
    }
}
