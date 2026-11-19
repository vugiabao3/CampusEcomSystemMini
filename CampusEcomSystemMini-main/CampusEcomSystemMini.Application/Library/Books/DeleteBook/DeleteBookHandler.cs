using CampusEcomSystemMini.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;

namespace CampusEcomSystemMini.Application.Library.Books.DeleteBook;

public class DeleteBookHandler
    : IRequestHandler<DeleteBookCommand, DeleteBookResult>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly ICurrentUserService _currentUserService;

    private readonly IDistributedCache _cache;

    private const string CacheVersionKey =
    "Library:Books:List:Version";
    public DeleteBookHandler(
        IBookExchangeRepository bookExchangeRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _currentUserService = currentUserService;
        _cache = cache;
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

        try
{
    await _cache.SetStringAsync(
        CacheVersionKey,
        Guid.NewGuid().ToString("N"),
        new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow =
                TimeSpan.FromDays(30)
        },
        CancellationToken.None);
}
catch (Exception)
{
    // Database đã lưu thành công; không làm API thất bại
    // chỉ vì Redis không khả dụng.
}

        return new DeleteBookResult(
            DeleteBookOutcome.Deleted,
            new DeleteBookResponse(
                true,
                "Book exchange post deleted successfully."));
    }
}
