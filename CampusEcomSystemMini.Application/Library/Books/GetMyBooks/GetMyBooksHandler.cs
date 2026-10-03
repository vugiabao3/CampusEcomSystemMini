using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetMyBooks;

public class GetMyBooksHandler
    : IRequestHandler<GetMyBooksQuery, List<GetMyBooksResponse>>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyBooksHandler(
        IBookExchangeRepository bookExchangeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetMyBooksResponse>> Handle(
        GetMyBooksQuery request,
        CancellationToken cancellationToken)
    {
        // Chủ bài đăng luôn lấy từ người dùng đang đăng nhập.
        var userId = _currentUserService.UserId;

        var posts = await _bookExchangeRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        if (posts.Count == 0)
        {
            return [];
        }

        var owner = await _userRepository.GetByIdAsync(
            userId,
            cancellationToken);

        var fullName = owner?.FullName ?? string.Empty;

        return posts
            .Select(post => new GetMyBooksResponse(
                post.Id,
                post.UserId,
                fullName,
                post.BookName,
                post.WantedBookName,
                post.Condition,
                post.Description,
                post.Status,
                post.CreatedAt,
                post.UpdatedAt))
            .ToList();
    }
}
