import { LEADERBOARD_PERIODS } from "../../services/leaderboardService.js";

function getInitials(fullName) {
  const value = (fullName ?? "").trim();

  if (!value) {
    return "SV";
  }

  return value
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

// Badge chưa có quy tắc trong Module 6 nên Backend trả rỗng.
// Chỉ hiển thị khi có giá trị.
function getBadgeLabel(badge) {
  return badge ? String(badge) : "";
}

// BẢNG XẾP HẠNG — MODULE_6 / BATCH 2.
//        ↓
// GET /api/leaderboard?period=month | year
// GET /api/leaderboard/me?period=month | year
export default function Leaderboard({
  period,
  onChangePeriod,
  entries,
  myRank,
  loading,
  error,
  onBack,
}) {
  const isYear = period === "year";

  return (
    <section className="pref-card leaderboard-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">BẢNG XẾP HẠNG</span>

          <h1 className="pref-title">Điểm uy tín</h1>

          <p className="pref-subtitle">
            Xếp hạng sinh viên theo điểm uy tín tích luỹ,
            cập nhật mỗi khi có giao dịch điểm mới.
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {entries?.length ?? 0} người
        </span>
      </div>

      <div className="leaderboard-tabs" role="tablist">
        {LEADERBOARD_PERIODS.map((item) => {
          const isActive = item.value === period;

          return (
            <button
              className={`leaderboard-tab ${
                isActive ? "leaderboard-tab--active" : ""
              }`}
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangePeriod(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {myRank && (
        <div className="my-rank-card">
          <div className="my-rank-main">
            <span className="my-rank-label">Hạng của bạn</span>

            <strong className="my-rank-value">
              #{myRank.rank}
            </strong>
          </div>

          <div className="my-rank-side">
            <span className="my-rank-period">
              {isYear ? "Kỳ năm" : "Kỳ tháng"}
            </span>

            <span className="my-rank-points">
              {myRank.reputationPoints ?? 0} điểm
            </span>

            {getBadgeLabel(myRank.badge) && (
              <span className="my-rank-badge">
                {getBadgeLabel(myRank.badge)}
              </span>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="posts-state">
          Đang tải bảng xếp hạng...
        </div>
      )}

      {!loading && (entries?.length ?? 0) === 0 && (
        <div className="posts-state posts-state--empty">
          Chưa có dữ liệu xếp hạng.
        </div>
      )}

      {!loading && (entries?.length ?? 0) > 0 && (
        <ul className="leaderboard-list">
          {entries.map((entry) => {
            const badge = getBadgeLabel(entry.badge);

            return (
              <li
                className={`leaderboard-item ${
                  entry.rank === 1 ? "leaderboard-item--top" : ""
                }`}
                key={entry.userId}
              >
                <span className="leaderboard-rank">
                  #{entry.rank}
                </span>

                {entry.avatarUrl ? (
                  <img
                    className="leaderboard-avatar"
                    src={entry.avatarUrl}
                    alt={entry.fullName || "Người dùng"}
                  />
                ) : (
                  <span className="leaderboard-avatar leaderboard-avatar--text">
                    {getInitials(entry.fullName)}
                  </span>
                )}

                <div className="leaderboard-main">
                  <span className="leaderboard-name">
                    {entry.fullName || "Chưa có tên"}
                  </span>

                  <span className="leaderboard-user-id">
                    {entry.userId}
                  </span>
                </div>

                <div className="leaderboard-side">
                  <span className="leaderboard-points">
                    {entry.reputationPoints ?? 0} điểm
                  </span>

                  {badge && (
                    <span className="leaderboard-badge">{badge}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
