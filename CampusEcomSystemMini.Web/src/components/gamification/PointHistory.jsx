function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Điểm cộng (dương) hiển thị có dấu +,
// điểm trừ (âm) giữ nguyên dấu -.
function formatChange(change) {
  const value = Number(change);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value > 0 ? `+${value}` : String(value);
}

function getChangeClass(change) {
  return Number(change) < 0
    ? "points-change points-change--minus"
    : "points-change points-change--plus";
}

// Lịch sử cộng / trừ điểm của người dùng đang đăng nhập.
//        ↓
// GET /api/gamification/history
export default function PointHistory({
  history,
  loading,
  error,
}) {
  return (
    <div className="points-history">
      <div className="points-history-head">
        <span className="eyebrow">LỊCH SỬ ĐIỂM</span>

        <span className="points-history-count">
          {history?.length ?? 0} giao dịch
        </span>
      </div>

      {loading && (
        <div className="posts-state">
          Đang tải lịch sử điểm...
        </div>
      )}

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        (history?.length ?? 0) === 0 ? (
          <div className="posts-state posts-state--empty">
            Chưa có giao dịch điểm nào.
          </div>
        ) : (
          <ul className="points-list">
            {history.map((entry) => (
              <li className="points-item" key={entry?.id}>
                <div className="points-item-main">
                  <span className="points-item-reason">
                    {entry?.reason || "—"}
                  </span>

                  <span className="points-item-meta">
                    <span className="points-item-type">
                      {entry?.type || "—"}
                    </span>

                    <span className="points-item-time">
                      {formatDate(entry?.createdAt) || "—"}
                    </span>
                  </span>
                </div>

                <div className="points-item-side">
                  <span className={getChangeClass(entry?.change)}>
                    {formatChange(entry?.change)}
                  </span>

                  <span className="points-item-balance">
                    Dư {Number(entry?.balance ?? 0)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
