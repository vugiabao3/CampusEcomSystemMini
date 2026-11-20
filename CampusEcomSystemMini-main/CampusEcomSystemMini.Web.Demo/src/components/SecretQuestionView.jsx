// Xem Câu Hỏi Bí Mật.
// Người bị mất đồ xem câu hỏi của người nhặt đồ.
// Câu trả lời bí mật không có trong phản hồi nên không
// được hiển thị ở đây.
export default function SecretQuestionView({
  item,
  question,
  loading,
  error,
  onAnswer,
  onClose,
}) {
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
        >
          ×
        </button>

        <div className="form-heading">
          <span className="eyebrow">XÁC MINH SỞ HỮU TÀI SẢN</span>

          <h2>
            Câu hỏi bí mật
          </h2>

          <p>
            {item?.title}
          </p>
        </div>

        {loading && (
          <div className="posts-state">
            Đang tải câu hỏi bí mật...
          </div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && question && (
          <>
            <div className="lost-question-box">
              <span className="lost-question-label">
                Câu hỏi
              </span>

              <p className="lost-question-text">{question}</p>
            </div>

            <div className="lost-note">
              Câu trả lời chỉ dùng để xác minh với người nhặt đồ và
              không được hiển thị trên hệ thống.
            </div>
          </>
        )}

        <div className="posts-actions">
          {!loading && !error && question && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={onAnswer}
            >
              Trả lời câu hỏi
            </button>
          )}

          <button
            className="btn btn--ghost"
            type="button"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}