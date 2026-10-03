using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Books.GetExchangeMatches;

// Ghép đổi sách cho các bài đăng của người đang đăng nhập.
//
// Đồ thị: mỗi bài đăng là một cạnh
// Wanted Book Name -> Book Name (sách cần nhận được sách đang có).
//
// Level 1 — Direct match:
//     A cần X, B có X  =>  A đổi được ngay với B.
//
// Level 2 — Cycle match:
//     A cần X, B có X và B cần Y, C có Y và C cần Z, A có Z
//     => chuỗi đổi sách A -> B -> C -> A.
//
// Thuật toán chỉ duyệt trực tiếp và chuỗi tối đa 3 người,
// đủ cho sàn đổi sách mà không cần thuật toán đồ thị phức tạp.
public class GetExchangeMatchesHandler
    : IRequestHandler<GetExchangeMatchesQuery, List<GetExchangeMatchesResponse>>
{
    // Tên sách được so khớp không phân biệt hoa thường.
    private const string DirectMatchType = "Direct";

    private const string CycleMatchType = "Cycle";

    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetExchangeMatchesHandler(
        IBookExchangeRepository bookExchangeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetExchangeMatchesResponse>> Handle(
        GetExchangeMatchesQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var myPosts = await _bookExchangeRepository.GetByUserIdAsync(
            currentUserId,
            cancellationToken);

        if (myPosts.Count == 0)
        {
            return [];
        }

        // Toàn bộ bài đăng để dựng chuỗi đổi sách.
        var allPosts = await _bookExchangeRepository.GetAllAsync(
            null,
            null,
            cancellationToken);

        // Bài đăng của người khác mới là đối tác đổi sách.
        var otherPosts = allPosts
            .Where(x => x.UserId != currentUserId)
            .ToList();

        if (otherPosts.Count == 0)
        {
            return [];
        }

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetExchangeMatchesResponse>();

        // Một cặp bài đăng chỉ xuất hiện một lần,
        // direct match được ưu tiên trước cycle match.
        var seenPairs = new HashSet<string>();

        foreach (var myPost in myPosts)
        {
            AppendDirectMatches(
                myPost,
                otherPosts,
                userById,
                seenPairs,
                result);

            AppendCycleMatches(
                myPost,
                otherPosts,
                userById,
                seenPairs,
                result);
        }

        return result
            .OrderByDescending(x => x.MatchedCreatedAt)
            .ToList();
    }

    // Level 1: A cần X, B có X.
    private static void AppendDirectMatches(
        BookExchangePost myPost,
        List<BookExchangePost> otherPosts,
        Dictionary<Guid, User> userById,
        HashSet<string> seenPairs,
        List<GetExchangeMatchesResponse> result)
    {
        foreach (var other in otherPosts)
        {
            if (!IsSameBook(
                    myPost.WantedBookName,
                    other.BookName))
            {
                continue;
            }

            if (!seenPairs.Add(
                    BuildPairKey(myPost.Id, other.Id)))
            {
                continue;
            }

            result.Add(BuildMatch(
                myPost,
                other,
                userById,
                DirectMatchType,
                $"{myPost.BookName} → {other.BookName}"));
        }
    }

    // Level 2: A -> B -> C -> A, tối đa MaxChainLength người.
    private static void AppendCycleMatches(
        BookExchangePost myPost,
        List<BookExchangePost> otherPosts,
        Dictionary<Guid, User> userById,
        HashSet<string> seenPairs,
        List<GetExchangeMatchesResponse> result)
    {
        foreach (var middle in otherPosts)
        {
            if (!IsSameBook(
                    myPost.WantedBookName,
                    middle.BookName))
            {
                continue;
            }

            foreach (var last in otherPosts)
            {
                if (last.Id == middle.Id ||
                    last.UserId == middle.UserId)
                {
                    continue;
                }

                // C có sách B đang tìm và C cần sách A đang có
                // => chuỗi A -> B -> C -> A khép kín.
                if (!IsSameBook(
                        middle.WantedBookName,
                        last.BookName))
                {
                    continue;
                }

                if (!IsSameBook(
                        last.WantedBookName,
                        myPost.BookName))
                {
                    continue;
                }

                if (!seenPairs.Add(
                        BuildPairKey(myPost.Id, last.Id)))
                {
                    continue;
                }

                result.Add(BuildMatch(
                    myPost,
                    last,
                    userById,
                    CycleMatchType,
                    $"{myPost.BookName} → {middle.BookName} → {last.BookName}"));
            }
        }
    }

    private static GetExchangeMatchesResponse BuildMatch(
        BookExchangePost myPost,
        BookExchangePost other,
        Dictionary<Guid, User> userById,
        string matchType,
        string chain)
    {
        userById.TryGetValue(other.UserId, out var owner);

        return new GetExchangeMatchesResponse(
            myPost.Id,
            other.Id,
            other.UserId,
            owner?.FullName ?? string.Empty,
            myPost.BookName,
            myPost.WantedBookName,
            other.BookName,
            other.WantedBookName,
            other.Condition,
            matchType,
            chain,
            other.CreatedAt);
    }

    // So khớp tên sách, không phân biệt hoa thường
    // và bỏ qua khoảng trắng thừa.
    private static bool IsSameBook(string? valueA, string? valueB)
    {
        if (string.IsNullOrWhiteSpace(valueA) ||
            string.IsNullOrWhiteSpace(valueB))
        {
            return false;
        }

        return string.Equals(
            valueA.Trim(),
            valueB.Trim(),
            StringComparison.OrdinalIgnoreCase);
    }

    private static string BuildPairKey(
        Guid postId,
        Guid matchedPostId)
    {
        return $"{postId:N}|{matchedPostId:N}";
    }
}
