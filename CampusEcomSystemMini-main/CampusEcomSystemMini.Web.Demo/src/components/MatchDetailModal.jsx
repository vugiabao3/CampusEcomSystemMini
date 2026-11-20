// Chi tiết mức độ phù hợp với một sinh viên.
// MatchScore lấy từ GET /api/matching/students/{userId}.
export default function MatchDetailModal({
  detail,
  loading,
  error,
  onClose,
}) {
  const fullName = detail?.fullName ?? "";
  const avatarUrl = detail?.avatarUrl ?? null;

  const score = Number(detail?.matchScore);
  const displayScore = Number.isFinite(score)
    ? score.toFixed(score % 1 === 0 ? 0 : 1)
    : "0";

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
          <div className="match-state">Đang tính mức độ phù hợp...</div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && detail && (
          <>
            <span className="eyebrow">SMART MATCHING</span>

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