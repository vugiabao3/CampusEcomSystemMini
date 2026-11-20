import MatchCard from "./MatchCard.jsx";

// Danh sách kết quả Smart Matching từ backend,
// đã được sắp xếp MatchScore DESC sẵn ở Backend.
export default function StudentMatchList({ matches, onOpenDetail }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="match-state match-state--empty">
        <span className="match-state-icon">◎</span>

        <p className="match-state-title">
          Chưa tìm thấy người phù hợp.
        </p>

        <p className="match-state-text">
          Cập nhật vector nhu cầu để tìm bạn học hoặc bạn ở
          ghép phù hợp hơn.
        </p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {matches.map((match) => (
        <MatchCard
          key={match.userId}
          match={match}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}