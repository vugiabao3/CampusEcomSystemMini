import { useState } from "react";

// Gửi Câu Trả Lời Cho Finder.
// Người bị mất đồ trả lời câu hỏi bí mật, Backend tự xác minh.
// Câu trả lời không được lưu ở Frontend.
export default function ClaimForm({
  item,
  question,
  saving,
  error,
  onSubmit,
  onClose,
}) {
  const [answer, setAnswer] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");

    if (!answer.trim()) {
      setValidationError("Vui lòng nhập câu trả lời.");
      return;
    }

    await onSubmit({ answer: answer.trim() });
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
            <span className="eyebrow">XÁC MINH SỞ HỮU TÀI SẢN</span>

            <h2>
              Gửi Câu Trả Lời
            </h2>

            <p>
              {item?.title}
            </p>
          </div>

          <div className="lost-question-box">
            <span className="lost-question-label">
              Câu hỏi bí mật
            </span>

            <p className="lost-question-text">{question}</p>
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
            <label htmlFor="claim-answer">
              Câu trả lời
            </label>

            <input
              id="claim-answer"
              type="text"
              placeholder="Nhập câu trả lời của bạn..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="posts-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Đang gửi..."
                : "Gửi Câu Trả Lời Cho Finder"}
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