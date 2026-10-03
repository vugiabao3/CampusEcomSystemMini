import { useState } from "react";

import { BOOK_CONDITIONS } from "../../services/libraryService.js";

// Form đăng / sửa bài đổi sách.
// book = null  => tạo bài đổi sách mới
// book = object => sửa bài đổi sách đã có
//
// Không có ô nhập UserId: chủ bài đăng lấy từ JWT ở Backend.
export default function BookExchangeForm({
  book,
  saving,
  error,
  onSubmit,
  onClose,
}) {
  const isEdit = Boolean(book);

  const [bookName, setBookName] = useState(book?.bookName ?? "");

  const [wantedBookName, setWantedBookName] = useState(
    book?.wantedBookName ?? ""
  );

  const [condition, setCondition] = useState(book?.condition ?? "");

  const [description, setDescription] = useState(
    book?.description ?? ""
  );

  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");

    if (!bookName.trim()) {
      setValidationError("Vui lòng nhập tên sách đang có.");
      return;
    }

    if (!wantedBookName.trim()) {
      setValidationError("Vui lòng nhập tên sách đang tìm.");
      return;
    }

    if (!condition.trim()) {
      setValidationError("Vui lòng chọn tình trạng sách.");
      return;
    }

    await onSubmit({
      bookName: bookName.trim(),
      wantedBookName: wantedBookName.trim(),
      condition: condition.trim(),
      description: description.trim(),
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>

        <form className="auth-form modal-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="eyebrow">SÀN ĐỔI SÁCH</span>

            <h2>
              {isEdit ? "Sửa bài đổi sách" : "Đăng đổi sách"}
            </h2>

            <p>
              Nêu rõ sách bạn đang có và sách bạn đang tìm
              để tìm được người đổi sách phù hợp.
            </p>
          </div>

          {validationError && (
            <div className="message message-error" role="alert">
              {validationError}
            </div>
          )}

          {error && (
            <div className="message message-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="book-book-name">
              Tên sách đang có
            </label>

            <input
              id="book-book-name"
              type="text"
              placeholder="Giáo trình Giải tích 1"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-wanted-book-name">
              Tên sách đang tìm
            </label>

            <input
              id="book-wanted-book-name"
              type="text"
              placeholder="Giáo trình Triết học"
              value={wantedBookName}
              onChange={(e) => setWantedBookName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-condition">Tình trạng</label>

            <select
              id="book-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">Chọn tình trạng</option>

              {BOOK_CONDITIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="book-description">Mô tả</label>

            <textarea
              id="book-description"
              rows={5}
              placeholder="Ghi chú thêm về sách, ghi chép, bìa sách..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="posts-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Đăng"}
            </button>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
