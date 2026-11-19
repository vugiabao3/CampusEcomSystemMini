import { useState } from "react";

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
  loading,
  error,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    await onLogin({
      email: email.trim(),
      password,
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">CHÀO MỪNG TRỞ LẠI</span>
        <h2>Đăng nhập</h2>
        <p>Tiếp tục kết nối cùng cộng đồng sinh viên.</p>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email sinh viên</label>

        <input
          id="login-email"
          type="email"
          placeholder="ban@sv.huce.edu.vn"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Mật khẩu</label>

        <input
          id="login-password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="form-footer">
        Chưa có tài khoản?{" "}
        <button
          className="text-button"
          type="button"
          onClick={onSwitchToRegister}
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
}