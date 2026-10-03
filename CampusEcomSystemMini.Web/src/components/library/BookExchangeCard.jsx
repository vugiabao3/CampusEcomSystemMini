import {
  formatBookDate,
  getStatusClass,
  getStatusLabel,
} from "./bookExchangeStatus.js";

// Một bài đăng đổi sách trong danh sách.
// Toàn bộ dữ liệu do Backend trả về, frontend chỉ hiển thị.
export default function BookExchangeCard({
  book,
  isOwner,
  onOpenDetail,
  onEdit,
  onDelete,
}) {
  const bookName = book?.bookName ?? "";

  const wantedBookName = book?.wantedBookName ?? "";

  const condition = book?.condition ?? "";

  const description = book?.description ?? "";

  return (
    <article className="book-card">
      <div className="book-card-head">
        <div className="book-card-head-main">
          <h3 className="book-card-title">{bookName}</h3>

          <span className="book-card-author">
            {book?.fullName ?? "Sinh viên"}
          </span>
        </div>

        <span className={getStatusClass(book?.status)}>
          {getStatusLabel(book?.status)}
        </span>
      </div>

      <div className="book-card-swap">
        <span className="book-card-swap-item">
          <span className="book-card-swap-label">Đang có</span>

          <span className="book-card-swap-value">{bookName}</span>
        </span>

        <span className="book-card-swap-arrow" aria-hidden>
          ⇄
        </span>

        <span className="book-card-swap-item">
          <span className="book-card-swap-label">Đang tìm</span>

          <span className="book-card-swap-value">
            {wantedBookName}
          </span>
        </span>
      </div>

      {description && (
        <p className="book-card-description">{description}</p>
      )}

      <div className="book-card-meta">
        <span className="book-card-meta-item">
          <span className="book-card-meta-label">Tình trạng</span>

          <span className="book-card-meta-value">{condition}</span>
        </span>

        <span className="book-card-meta-item">
          <span className="book-card-meta-label">Thời gian</span>

          <span className="book-card-meta-value">
            {formatBookDate(book?.createdAt) || "—"}
          </span>
        </span>
      </div>

      <div className="book-card-actions">
        <button
          className="book-action book-action--view"
          type="button"
          onClick={() => onOpenDetail(book)}
        >
          Xem chi tiết
        </button>

        {isOwner && (
          <>
            <button
              className="book-action"
              type="button"
              onClick={() => onEdit(book)}
            >
              Sửa
            </button>

            <button
              className="book-action book-action--delete"
              type="button"
              onClick={() => onDelete(book)}
            >
              Xóa
            </button>
          </>
        )}
      </div>
    </article>
  );
}
