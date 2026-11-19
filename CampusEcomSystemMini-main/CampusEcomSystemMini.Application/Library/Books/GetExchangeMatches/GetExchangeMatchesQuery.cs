using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetExchangeMatches;

// GET /api/library/books/exchange-matches
// Tìm các bài đăng khớp với bài đăng của người đang đăng nhập.
// UserId lấy từ ICurrentUserService, không nhận từ client.
public record GetExchangeMatchesQuery : IRequest<List<GetExchangeMatchesResponse>>;
