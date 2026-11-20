import { useState } from "react";

export default function EditProfile({
  user,
  onSave,
  onCancel,
  loading,
  error,
}) {
  const [fullName, setFullName] = useState(
    user?.fullName ?? user?.FullName ?? ""
  );
  const [email, setEmail] = useState(
    user?.email ?? user?.Email ?? ""
  );
  const [phone, setPhone] = useState(
    user?.phone ?? user?.Phone ?? ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl ?? user?.AvatarUrl ?? ""
  );
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!fullName.trim() || !email.trim()) {
      setValidationError("Họ và tên và email không được để trống.");
      return;
    }

    await onSave({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim(),
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">TÀI KHOẢN CỦA BẠN</span>
        <h2>Chỉnh sửa hồ sơ</h2>
        <p>Cập nhật thông tin cá nhân và số điện thoại.</p>
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
        <label htmlFor="edit-name">Họ và tên</label>
        <input
          id="edit-name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-email">Email</label>
        <input
          id="edit-email"
          type="email"
          placeholder="ban@sv.huce.edu.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-phone">Số điện thoại</label>
        <input
          id="edit-phone"
          type="tel"
          placeholder="0123456789"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-avatar">Đường dẫn ảnh đại diện</label>
        <input
          id="edit-avatar"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
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
