import { useState } from "react";

export default function ChangePassword({
  onSave,
  onCancel,
  loading,
  error,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!currentPassword) {
      setValidationError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!newPassword) {
      setValidationError("Vui lòng nhập mật khẩu mới.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Mật khẩu mới không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setValidationError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    await onSave({
      currentPassword,
      newPassword,
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">TÀI KHOẢN CỦA BẠN</span>
        <h2>Đổi mật khẩu</h2>
        <p>Nhập mật khẩu hiện tại và mật khẩu mới.</p>
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
        <label htmlFor="current-password">Mật khẩu hiện tại</label>
        <input
          id="current-password"
          type="password"
          placeholder="Nhập mật khẩu hiện tại"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="new-password">Mật khẩu mới</label>
        <input
          id="new-password"
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Đổi mật khẩu"}
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
