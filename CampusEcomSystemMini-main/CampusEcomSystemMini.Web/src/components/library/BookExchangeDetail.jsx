import {
  formatBookDate,
  getStatusClass,
  getStatusLabel,
} from "./bookExchangeStatus.js";

// Chi tiết một bài đăng đổi sách,
// dữ liệu lấy từ GET /api/library/books/{id}.
export default function BookExchangeDetail({
  book,
  loading,
  error,
  isOwner,
  onEdit,
  onDelete,
  onClose,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card--detail"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
        >
          ×
        </button>

        {loading && (
          <div className="posts-state">
            Đang tải chi tiết bài đổi sách...
          </div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && book && (
          <>
            <div className="post-detail-head">
              <span className="post-type">Đổi sách</span>

              {isOwner && (
                <span className="post-owner-badge">Của bạn</span>
              )}

              <span className={getStatusClass(book.status)}>
                {getStatusLabel(book.status)}
              </span>
            </div>

            <h2 className="post-detail-title">
              {book.bookName}
            </h2>

            <div className="book-detail-swap">
              <span className="book-detail-swap-item">
                <span className="book-card-swap-label">
                  Đang có
                </span>

                <span className="book-detail-swap-value">
                  {book.bookName}
                </span>
              </span>

              <span className="book-card-swap-arrow" aria-hidden>
                ⇄
              </span>

              <span className="book-detail-swap-item">
                <span className="book-card-swap-label">
                  Đang tìm
                </span>

                <span className="book-detail-swap-value">
                  {book.wantedBookName}
                </span>
              </span>
            </div>

            <div className="book-detail-meta">
              <span className="book-detail-meta-item">
                <span className="book-card-meta-label">Tình trạng</span>

                <span className="book-detail-meta-value">
                  {book.condition}
                </span>
              </span>

              <span className="book-detail-meta-item">
                <span className="book-card-meta-label">
                  Người đăng
                </span>

                <span className="book-detail-meta-value">
                  {book.fullName || "Sinh viên"}
                </span>
              </span>

              <span className="book-detail-meta-item">
                <span className="book-card-meta-label">
                  Thời gian
                </span>

                <span className="book-detail-meta-value">
                  {formatBookDate(book.createdAt) || "—"}
                </span>
              </span>
            </div>

            {book.description && (
              <p className="post-detail-content">
                {book.description}
              </p>
            )}

            {book.updatedAt &&
              book.updatedAt !== book.createdAt && (
                <p className="post-detail-updated">
                  Cập nhật lần cuối:{" "}
                  {formatBookDate(book.updatedAt)}
                </p>
              )}

            <div className="posts-actions">
              {isOwner && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onEdit(book)}
                  >
                    Sửa bài đổi sách
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => onDelete(book)}
                  >
                    Xóa bài đổi sách
                  </button>
                </>
              )}

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
