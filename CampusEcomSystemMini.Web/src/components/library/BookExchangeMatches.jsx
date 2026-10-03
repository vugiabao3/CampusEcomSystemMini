import {
  formatBookDate,
  getMatchTypeClass,
  getMatchTypeLabel,
} from "./bookExchangeStatus.js";

// Các cặp / chuỗi đổi sách khớp với bài đăng của người đang đăng nhập,
// lấy từ GET /api/library/books/exchange-matches.
export default function BookExchangeMatches({
  matches,
  loading,
  error,
  onOpenDetail,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tìm chuỗi đổi sách...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message message-error" role="alert">
        {error}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa tìm thấy bài đăng nào khớp với sách của bạn.
      </div>
    );
  }

  return (
    <div className="book-match-list">
      {matches.map((match) => (
        <article
          className={
            match.matchType === "Cycle"
              ? "book-match book-match--cycle"
              : "book-match"
          }
          key={`${match.postId}-${match.matchedPostId}`}
        >
          <div className="book-match-head">
            <div className="book-match-head-main">
              <span className={getMatchTypeClass(match.matchType)}>
                {getMatchTypeLabel(match.matchType)}
              </span>

              <h4 className="book-match-chain">{match.chain}</h4>
            </div>

            <button
              className="book-action book-action--view"
              type="button"
              onClick={() => onOpenDetail(match)}
            >
              Xem bài đăng
            </button>
          </div>

          <div className="book-match-meta">
            <span className="book-match-meta-item">
              <span className="book-card-meta-label">Người đăng</span>

              <span className="book-match-meta-value">
                {match.matchedFullName || "Sinh viên"}
              </span>
            </span>

            <span className="book-match-meta-item">
              <span className="book-card-meta-label">
                Họ đang có
              </span>

              <span className="book-match-meta-value">
                {match.matchedBookName}
              </span>
            </span>

            <span className="book-match-meta-item">
              <span className="book-card-meta-label">
                Họ đang tìm
              </span>

              <span className="book-match-meta-value">
                {match.matchedWantedBookName}
              </span>
            </span>

            <span className="book-match-meta-item">
              <span className="book-card-meta-label">
                Tình trạng
              </span>

              <span className="book-match-meta-value">
                {match.matchedCondition}
              </span>
            </span>
          </div>

          <span className="book-match-time">
            Đăng {formatBookDate(match.matchedCreatedAt) || "—"}
          </span>
        </article>
      ))}
    </div>
  );
}