using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.UpdateBook;

public class UpdateBookHandler
    : IRequestHandler<UpdateBookCommand, UpdateBookResult>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateBookHandler(
        IBookExchangeRepository bookExchangeRepository,
        ICurrentUserService currentUserService)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateBookResult> Handle(
        UpdateBookCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var post = await _bookExchangeRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (post is null)
        {
            return new UpdateBookResult(
                UpdateBookOutcome.NotFound,
                null);
        }

        // Không cho sửa bài đăng của người dùng khác.
        if (post.UserId != userId)
        {
            return new UpdateBookResult(
                UpdateBookOutcome.NotOwner,
                null);
        }

        post.BookName = request.BookName.Trim();
        post.WantedBookName = request.WantedBookName.Trim();
        post.Condition = request.Condition.Trim();
        post.Description = string.IsNullOrWhiteSpace(request.Description)
            ? null
            : request.Description.Trim();
        post.UpdatedAt = DateTime.UtcNow;

        _bookExchangeRepository.UpdateAsync(
            post,
            cancellationToken);

        await _bookExchangeRepository.SaveChangesAsync(
            cancellationToken);

        return new UpdateBookResult(
            UpdateBookOutcome.Updated,
            new UpdateBookResponse(
                post.Id,
                post.UserId,
                post.BookName,
                post.WantedBookName,
                post.Condition,
                post.Description,
                post.Status,
                post.CreatedAt,
                post.UpdatedAt));
    }
}
