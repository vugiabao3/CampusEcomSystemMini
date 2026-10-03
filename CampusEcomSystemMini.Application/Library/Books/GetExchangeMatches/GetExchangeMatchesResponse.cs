namespace CampusEcomSystemMini.Application.Library.Books.GetExchangeMatches;

// Một cặp / một chuỗi đổi sách khớp với bài đăng của người đang đăng nhập.
// MatchType: Direct (A cần X + B có X)
// hoặc Cycle (A -> B -> C -> A).
// Chain mô tả luồng đổi sách dưới dạng tên sách nối tiếp.
public record GetExchangeMatchesResponse(
    Guid PostId,
    Guid MatchedPostId,
    Guid MatchedUserId,
    string MatchedFullName,
    string BookName,
    string WantedBookName,
    string MatchedBookName,
    string MatchedWantedBookName,
    string MatchedCondition,
    string MatchType,
    string Chain,
    DateTime MatchedCreatedAt
);
