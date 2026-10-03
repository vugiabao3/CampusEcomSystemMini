// Một ứng viên tìm trọ / ở ghép trong kết quả Room Matching.
// MatchScore và thông tin nhu cầu thuê trọ do backend trả về,
// frontend chỉ hiển thị.
export default function RoomMatchCard({ match, onOpenDetail }) {
  const userId = match?.userId ?? "";
  const fullName = match?.fullName ?? "";
  const avatarUrl = match?.avatarUrl ?? null;
  const roomPostTitle = match?.roomPostTitle ?? null;
  const preferredRentalArea = match?.preferredRentalArea ?? null;
  const monthlyRentalBudget = match?.monthlyRentalBudget ?? null;

  const score = Number(match?.matchScore);
  const displayScore = Number.isFinite(score)
    ? score.toFixed(score % 1 === 0 ? 0 : 1)
    : "0";

  function getScoreLevel() {
    if (score >= 80) {
      return "room-card--high";
    }

    if (score >= 60) {
      return "room-card--medium";
    }

    return "room-card--low";
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

  function formatBudget(budget) {
    const value = Number(budget);

    if (!Number.isFinite(value) || value <= 0) {
      return "Chưa cập nhật";
    }

    return `${value.toLocaleString("vi-VN")} đ/tháng`;
  }

  return (
    <article className={`room-card ${getScoreLevel()}`}>
      <div className="room-card-head">
        <div className="match-card-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} />
          ) : (
            <span>{fullName.charAt(0).toUpperCase() || "?"}</span>
          )}
        </div>

        <div className="room-card-person">
          <h3 className="match-card-name">{fullName}</h3>

          <span className="match-card-level">{getScoreLabel()}</span>
        </div>

        <div className="match-card-score room-card-score">
          <span className="match-card-score-value">
            {displayScore}%
          </span>

          <span className="match-card-score-label">
            Match
          </span>
        </div>
      </div>

      {roomPostTitle && (
        <p className="room-card-post">{roomPostTitle}</p>
      )}

      <div className="room-card-meta">
        <span className="room-card-meta-item">
          <span className="room-card-meta-label">Khu vực</span>
          <span className="room-card-meta-value">
            {preferredRentalArea ?? "Chưa cập nhật"}
          </span>
        </span>

        <span className="room-card-meta-item">
          <span className="room-card-meta-label">Ngân sách</span>
          <span className="room-card-meta-value">
            {formatBudget(monthlyRentalBudget)}
          </span>
        </span>
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