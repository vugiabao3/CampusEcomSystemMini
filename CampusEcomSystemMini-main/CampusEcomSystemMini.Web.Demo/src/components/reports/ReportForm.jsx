// ReportForm.jsx — Form báo cáo bài đăng (MODULE_6 / BATCH 3)
import { useState } from "react";

export default function ReportForm({
  postId,
  postTitle,
  onSubmit,
  onCancel,
  loading,
  error,
  success,
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const REASON_OPTIONS = [
    { value: "Spam", label: "Spam / Quảng cáo" },
    { value: "Inappropriate", label: "Nội dung không phù hợp" },
    { value: "Scam", label: "Lừa đảo / Gian lận" },
    { value: "Harassment", label: "Quấy rối / Xúc phạm" },
    { value: "Copyright", label: "Vi phạm bản quyền" },
    { value: "Other", label: "Lý do khác" },
  ];

  function handleSubmit(event) {
    event.preventDefault();

    if (!reason.trim()) {
      return;
    }

    onSubmit(reason.trim(), description.trim());
  }

  return (
    <div className="report-form-card">
      <h3 className="report-form-title">Báo cáo bài đăng</h3>

      {postTitle && (
        <p className="report-form-post">
          <strong>"{postTitle}"</strong>
        </p>
      )}

      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Lý do báo cáo <span className="required">*</span>
          </label>

          <select
            id="reason"
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Chọn lý do</option>
            {REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Mô tả chi tiết (tuỳ chọn)
          </label>

          <textarea
            id="description"
            className="form-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Mô tả thêm chi tiết về nội dung vi phạm..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="btn btn-danger"
            disabled={loading || !reason.trim()}
          >
            {loading ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
}