import LostFoundCard from "./LostFoundCard.jsx";

// Danh sách tin Lost & Found từ Backend,
// đã được lọc và sắp xếp sẵn ở Backend.
export default function LostFoundList({
  items,
  loading,
  error,
  currentUserId,
  onOpenSecretQuestion,
  onOpenClaims,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải đồ thất lạc...
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

  if (!items || items.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa tìm thấy đồ phù hợp.
      </div>
    );
  }

  return (
    <div className="lost-list">
      {items.map((item) => (
        <LostFoundCard
          key={item.postId}
          item={item}
          currentUserId={currentUserId}
          onOpenSecretQuestion={onOpenSecretQuestion}
          onOpenClaims={onOpenClaims}
        />
      ))}
    </div>
  );
}