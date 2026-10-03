// Form hiển thị thông tin tài khoản 
import MyPoints from "./gamification/MyPoints.jsx";
import PointHistory from "./gamification/PointHistory.jsx";

export default function UserProfile({
  user,
  onLogout,
  onEditProfile,
  onChangePassword,
  onOpenPreferences,
  onViewMyPosts,
  onOpenMatching,
  loading,
  error,
  points,
  pointsLoading,
  pointsError,
  history,
  historyLoading,
  historyError,
}) {
  const fullName = user?.fullName ?? user?.FullName ?? "Sinh viên";
  const email = user?.email ?? user?.Email ?? "";
  const role = user?.role ?? user?.Role ?? "User";
  const userId = user?.id ?? user?.Id ?? "";
  const phone = user?.phone ?? user?.Phone ?? "";
  const avatarUrl = user?.avatarUrl ?? user?.AvatarUrl ?? "";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <section className="profile-card">
      <div className="profile-top">
        <div className="avatar">{initials || "SV"}</div>

        <div>
          <span className="eyebrow">TÀI KHOẢN CỦA BẠN</span>
          <h2>{fullName}</h2>
          <p className="profile-email">{email}</p>
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-detail">
        <span>Vai trò</span>
        <strong>{role}</strong>
      </div>

      <div className="profile-detail">
        <span>Mã tài khoản</span>
        <strong className="user-id">{userId || "Chưa có dữ liệu"}</strong>
      </div>

      <div className="profile-detail">
        <span>Số điện thoại</span>
        <strong>{phone || "Chưa cập nhật"}</strong>
      </div>

      <div className="profile-detail">
        <span>Avatar</span>
        <strong className="user-id">{avatarUrl || "Chưa cập nhật"}</strong>
      </div>

      <div className="profile-divider" />

      <MyPoints
        points={points}
        loading={pointsLoading}
        error={pointsError}
      />

      <PointHistory
        history={history}
        loading={historyLoading}
        error={historyError}
      />

      <div className="profile-divider" />

      <div className="profile-actions">
        <button
          className="btn btn-primary"
          type="button"
          onClick={onEditProfile}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Chỉnh sửa hồ sơ"}
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={onChangePassword}
          disabled={loading}
        >
          Đổi mật khẩu
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={onOpenPreferences}
          disabled={loading}
        >
          Vector nhu cầu
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={onViewMyPosts}
          disabled={loading}
        >
          Bài đăng của tôi
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={onOpenMatching}
          disabled={loading}
        >
          Smart Matching
        </button>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <button
        className="btn btn-danger"
        type="button"
        onClick={onLogout}
        disabled={loading}
      >
        {loading ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
    </section>
  );
}