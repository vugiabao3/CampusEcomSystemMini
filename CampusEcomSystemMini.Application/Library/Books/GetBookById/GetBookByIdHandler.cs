using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetBookById;

public class GetBookByIdHandler
    : IRequestHandler<GetBookByIdQuery, GetBookByIdResponse?>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IUserRepository _userRepository;

    public GetBookByIdHandler(
        IBookExchangeRepository bookExchangeRepository,
        IUserRepository userRepository)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _userRepository = userRepository;
    }

    public async Task<GetBookByIdResponse?> Handle(
        GetBookByIdQuery request,
        CancellationToken cancellationToken)
    {
        var post = await _bookExchangeRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (post is null)
        {
            return null;
        }

        var owner = await _userRepository.GetByIdAsync(
            post.UserId,
            cancellationToken);

        return new GetBookByIdResponse(
            post.Id,
            post.UserId,
            owner?.FullName ?? string.Empty,
            post.BookName,
            post.WantedBookName,
            post.Condition,
            post.Description,
            post.Status,
            post.CreatedAt,
            post.UpdatedAt);
    }
}
