using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
namespace CampusEcomSystemMini.Application.Library.Books.CreateBook;

public class CreateBookHandler
    : IRequestHandler<CreateBookCommand, CreateBookResponse>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    private readonly IDistributedCache _cache;
    private const string CacheVersionKey =
        "Library:Books:List:Version";
    private const string PostsCacheVersionKey =
        "Posts:List:Version";
    public CreateBookHandler(
        IBookExchangeRepository bookExchangeRepository,
        IPostRepository postRepository,
        ICurrentUserService currentUserService,
        IDistributedCache cache)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _postRepository = postRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<CreateBookResponse> Handle(
        CreateBookCommand request,
        CancellationToken cancellationToken)
    {
        // Chủ bài đăng luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        var now = DateTime.UtcNow;

        var bookPost = new BookExchangePost
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
            bookPost,
            cancellationToken);

        // Tạo bài đăng cộng đồng (type = "library") để bài đổi sách
        // hiển thị trên Sàn Cộng đồng (GET /api/posts).
        var communityPost = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = bookPost.BookName,
            Content = BuildCommunityContent(bookPost),
            Type = "library",
            LibraryPostId = bookPost.Id,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _postRepository.AddAsync(
            communityPost,
            cancellationToken);

        await _bookExchangeRepository.SaveChangesAsync(
            cancellationToken);

        // Vô hiệu hóa cache sách và cache bài đăng cộng đồng
        // để GET /api/posts lấy được bài mới ngay lập tức.
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

        try
        {
            await _cache.SetStringAsync(
                PostsCacheVersionKey,
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
            // Bỏ qua lỗi Redis, không làm API thất bại.
        }

        return new CreateBookResponse(
            bookPost.Id,
            bookPost.UserId,
            bookPost.BookName,
            bookPost.WantedBookName,
            bookPost.Condition,
            bookPost.Description,
            bookPost.Status,
            bookPost.CreatedAt,
            bookPost.UpdatedAt);
    }

    private static string BuildCommunityContent(BookExchangePost book)
    {
        var parts = new List<string>
        {
            $"Đang tìm: {book.WantedBookName}",
            $"Tình trạng: {book.Condition}",
        };

        if (!string.IsNullOrWhiteSpace(book.Description))
        {
            parts.Add(book.Description);
        }

        return string.Join(" | ", parts);
    }
}
