import RoomMatchCard from "./RoomMatchCard.jsx";

// Danh sách ứng viên tìm trọ / ở ghép từ backend,
// đã được sắp xếp MatchScore DESC sẵn ở Backend.
export default function RoomMatchList({ matches, onOpenDetail }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="match-state match-state--empty">
        <span className="match-state-icon">⌂</span>

        <p className="match-state-title">
          Chưa tìm thấy người ở ghép phù hợp.
        </p>

        <p className="match-state-text">
          Cập nhật khu vực và ngân sách thuê trọ trong vector
          nhu cầu để tìm bạn ở ghép phù hợp hơn.
        </p>
      </div>
    );
  }

  return (
    <div className="room-list">
      {matches.map((match) => (
        <RoomMatchCard
          key={match.userId}
          match={match}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}