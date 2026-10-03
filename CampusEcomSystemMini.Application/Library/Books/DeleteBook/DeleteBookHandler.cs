using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.DeleteBook;

public class DeleteBookHandler
    : IRequestHandler<DeleteBookCommand, DeleteBookResult>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteBookHandler(
        IBookExchangeRepository bookExchangeRepository,
        ICurrentUserService currentUserService)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteBookResult> Handle(
        DeleteBookCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var post = await _bookExchangeRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (post is null)
        {
            return new DeleteBookResult(
                DeleteBookOutcome.NotFound,
                null);
        }

        // Chỉ chủ bài đăng mới được xóa bài của mình.
        if (post.UserId != userId)
        {
            return new DeleteBookResult(
                DeleteBookOutcome.NotOwner,
                null);
        }

        _bookExchangeRepository.Remove(post);

        await _bookExchangeRepository.SaveChangesAsync(
            cancellationToken);

        return new DeleteBookResult(
            DeleteBookOutcome.Deleted,
            new DeleteBookResponse(
                true,
                "Book exchange post deleted successfully."));
    }
}
