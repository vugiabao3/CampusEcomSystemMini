import { useState } from "react";

// Tạo Câu Hỏi Bí Mật Xác Minh.
// Chỉ chủ bài đăng Found được tạo.
// Sau khi lưu, Frontend không giữ và không hiển thị câu trả lời.
export default function SecretQuestionForm({
  item,
  saving,
  error,
  onSubmit,
  onClose,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");

    if (!question.trim()) {
      setValidationError("Vui lòng nhập câu hỏi bí mật.");
      return;
    }

    if (!answer.trim()) {
      setValidationError("Vui lòng nhập câu trả lời bí mật.");
      return;
    }

    await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
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
            <span className="eyebrow">XÁC MINH SỞ HỮU</span>

            <h2>
              Tạo Câu Hỏi Bí Mật
            </h2>

            <p>
              {item?.title}
            </p>
          </div>

          <div className="lost-note">
            Câu trả lời được lưu dạng mã hoá và không bao giờ được
            hiển thị lại. Người bị mất đồ sẽ trả lời câu hỏi này
            để nhận lại đồ.
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
            <label htmlFor="secret-question">
              Câu hỏi bí mật
            </label>

            <input
              id="secret-question"
              type="text"
              placeholder="Móc khóa có hình con vật gì và màu gì?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="secret-answer">
              Câu trả lời bí mật
            </label>

            <input
              id="secret-answer"
              type="text"
              placeholder="Con mèo màu xanh"
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
              {saving ? "Đang lưu..." : "Lưu câu hỏi"}
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