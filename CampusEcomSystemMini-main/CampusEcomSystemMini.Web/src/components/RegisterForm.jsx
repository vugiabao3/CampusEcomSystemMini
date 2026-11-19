import { useState } from "react";

export default function RegisterForm({
  onRegister,
  onSwitchToLogin,
  loading,
  error,
  success,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp.");
      return;
    }

    await onRegister({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">CỘNG ĐỒNG SINH VIÊN</span>
        <h2>Tạo tài khoản</h2>
        <p>Đăng ký để bắt đầu sử dụng CampusEcomSystemMini.</p>
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

      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="register-name">Họ và tên</label>

        <input
          id="register-name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email</label>

        <input
          id="register-email"
          type="email"
          placeholder="ban@sv.huce.edu.vn"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Mật khẩu</label>

        <input
          id="register-password"
          type="password"
          placeholder="Tạo mật khẩu"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm">
          Xác nhận mật khẩu
        </label>

        <input
          id="register-confirm"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          autoComplete="new-password"
          required
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>

      <p className="form-footer">
        Đã có tài khoản?{" "}
        <button
          className="text-button"
          type="button"
          onClick={onSwitchToLogin}
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}