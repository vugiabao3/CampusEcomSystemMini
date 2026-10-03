using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetBooks;

public class GetBooksHandler
    : IRequestHandler<GetBooksQuery, List<GetBooksResponse>>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IUserRepository _userRepository;

    public GetBooksHandler(
        IBookExchangeRepository bookExchangeRepository,
        IUserRepository userRepository)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GetBooksResponse>> Handle(
        GetBooksQuery request,
        CancellationToken cancellationToken)
    {
        var search = BookInput.NormalizeSearch(request.Search);

        var status = BookInput.NormalizeStatus(request.Status);

        // Bộ lọc được áp dụng ngay trong truy vấn database.
        var posts = await _bookExchangeRepository.GetAllAsync(
            search,
            status,
            cancellationToken);

        if (posts.Count == 0)
        {
            return [];
        }

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetBooksResponse>();

        foreach (var post in posts)
        {
            userById.TryGetValue(post.UserId, out var owner);

            result.Add(
                new GetBooksResponse(
                    post.Id,
                    post.UserId,
                    owner?.FullName ?? string.Empty,
                    post.BookName,
                    post.WantedBookName,
                    post.Condition,
                    post.Description,
                    post.Status,
                    post.CreatedAt));
        }

        return result;
    }
}
