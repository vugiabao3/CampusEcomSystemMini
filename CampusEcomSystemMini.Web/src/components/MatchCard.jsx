// Một ứng viên trong kết quả Smart Matching.
// MatchScore do backend tính, frontend chỉ hiển thị.
export default function MatchCard({ match, onOpenDetail }) {
  const userId = match?.userId ?? "";
  const fullName = match?.fullName ?? "";
  const avatarUrl = match?.avatarUrl ?? null;
  const matchScore = match?.matchScore ?? 0;

  const score = Number(matchScore);
  const displayScore = Number.isFinite(score)
    ? score.toFixed(score % 1 === 0 ? 0 : 1)
    : "0";

  function getScoreLevel() {
    if (score >= 80) {
      return "match-card--high";
    }

    if (score >= 60) {
      return "match-card--medium";
    }

    return "match-card--low";
  }

  function getScoreLabel() {
    if (score >= 80) {
      return "Phù hợp cao";
    }

    if (score >= 60) {
      return "Phù hợp khá";
    }

    return "Phù hợp trung bình";
  }

  return (
    <article className={`match-card ${getScoreLevel()}`}>
      <div className="match-card-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt={fullName} />
        ) : (
          <span>{fullName.charAt(0).toUpperCase() || "?"}</span>
        )}
      </div>

      <div className="match-card-body">
        <h3 className="match-card-name">{fullName}</h3>

        <span className="match-card-level">{getScoreLabel()}</span>

        <div className="match-card-score">
          <span className="match-card-score-value">
            {displayScore}%
          </span>

          <span className="match-card-score-label">
            Match
          </span>
        </div>
      </div>

      <button
        className="match-card-action"
        type="button"
        onClick={() => onOpenDetail(userId)}
      >
        Xem chi tiết
      </button>
    </article>
  );
}