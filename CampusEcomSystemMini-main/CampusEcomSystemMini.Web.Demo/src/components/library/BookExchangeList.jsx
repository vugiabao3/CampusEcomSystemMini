import BookExchangeCard from "./BookExchangeCard.jsx";

// Danh sách bài đăng đổi sách từ Backend,
// đã được lọc và sắp xếp sẵn ở Backend.
export default function BookExchangeList({
  books,
  loading,
  error,
  currentUserId,
  onOpenDetail,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải sàn đổi sách...
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

  if (!books || books.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa có bài đăng đổi sách nào.
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => {
        const isOwner =
          Boolean(currentUserId) &&
          String(book?.userId ?? "").toLowerCase() ===
            String(currentUserId).toLowerCase();

        return (
          <BookExchangeCard
            key={book.id}
            book={book}
            isOwner={isOwner}
            onOpenDetail={onOpenDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
