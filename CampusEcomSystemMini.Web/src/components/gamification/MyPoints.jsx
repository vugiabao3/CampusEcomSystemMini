// Điểm uy tín hiện tại của người dùng.
//        ↓
// GET /api/gamification/me
export default function MyPoints({
  points,
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải điểm uy tín...
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

  const reputationPoints = points?.reputationPoints ?? 0;

  return (
    <div className="points-card">
      <div className="points-card-main">
        <span className="eyebrow">ĐIỂM UY TÍN</span>

        <strong className="points-value">{reputationPoints}</strong>

        <span className="points-caption">
          Tổng điểm hiện tại của bạn
        </span>
      </div>

      <div className="points-card-side">
        <span className="points-label">Người dùng</span>

        <span className="points-user-id">
          {points?.userId ?? "—"}
        </span>
      </div>
    </div>
  );
}
