// Chi tiết mức độ phù hợp về chỗ ở với một ứng viên tìm trọ /
// ở ghép. MatchScore lấy từ GET /api/matching/rooms/{userId}.
export default function RoomMatchDetailModal({
  detail,
  loading,
  error,
  onClose,
}) {
  const fullName = detail?.fullName ?? "";
  const avatarUrl = detail?.avatarUrl ?? null;
  const roomPostTitle = detail?.roomPostTitle ?? null;
  const preferredRentalArea = detail?.preferredRentalArea ?? null;
  const monthlyRentalBudget = detail?.monthlyRentalBudget ?? null;

  const score = Number(detail?.matchScore);
  const displayScore = Number.isFinite(score)
    ? score.toFixed(score % 1 === 0 ? 0 : 1)
    : "0";

  function formatBudget(budget) {
    const value = Number(budget);

    if (!Number.isFinite(value) || value <= 0) {
      return "Chưa cập nhật";
    }

    return `${value.toLocaleString("vi-VN")} đ/tháng`;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card--match"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
        >
          ×
        </button>

        {loading && (
          <div className="match-state">
            Đang tính mức độ phù hợp...
          </div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && detail && (
          <>
            <span className="eyebrow">TÌM TRỌ / Ở GHÉP</span>

            <div className="match-detail-person">
              <div className="match-card-avatar match-card-avatar--large">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} />
                ) : (
                  <span>
                    {fullName.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div>
                <h2 className="match-detail-name">{fullName}</h2>

                <p className="match-detail-text">
                  Mức độ phù hợp được hệ thống tính từ
                  vector nhu cầu của hai bên.
                </p>
              </div>
            </div>

            <div className="match-detail-score">
              <span className="match-detail-score-value">
                {displayScore}%
              </span>

              <span className="match-detail-score-label">
                Match Score
              </span>
            </div>

            <dl className="room-detail-grid">
              <div className="room-detail-item">
                <dt>Khu vực mong muốn</dt>
                <dd>{preferredRentalArea ?? "Chưa cập nhật"}</dd>
              </div>

              <div className="room-detail-item">
                <dt>Ngân sách thuê</dt>
                <dd>{formatBudget(monthlyRentalBudget)}</dd>
              </div>

              <div className="room-detail-item room-detail-item--wide">
                <dt>Bài đăng tìm trọ</dt>
                <dd>{roomPostTitle ?? "Chưa có bài đăng"}</dd>
              </div>
            </dl>

            <div className="match-actions">
              <button
                className="btn btn--ghost"
                type="button"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}