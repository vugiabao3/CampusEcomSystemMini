import HomeIcon from "./home/HomeIcon.jsx";
import { getInitials } from "./home/initials.js";

// Header dùng chung cho Trang chủ và trang "Tất cả bài đăng".
//
// Component này chỉ lo phần hiển thị, mọi hành động đều do
// App.jsx truyền xuống nên không phát sinh API mới.
//
// Logo/brand "CampusEcom" là một button: bấm sẽ quay về Trang chủ
// bằng đúng cơ chế điều hướng hiện có (setPage trong App.jsx).

export default function CampusHeader({
  user,
  unreadCount = 0,
  navItems = [],
  activeNavKey = "",
  onGoHome,
  onViewProfile,
  onLogout,
}) {
  const fullName =
    user?.fullName ??
    user?.FullName ??
    "Sinh viên";

  const email =
    user?.email ??
    user?.Email ??
    "";

  const avatarUrl =
    user?.avatarUrl ??
    user?.AvatarUrl ??
    "";

  const initials = getInitials(fullName);

  const hasUnread = Number(unreadCount) > 0;

  return (
    <header className="home-header">

      <div className="home-header-inner">

        <button
          className="home-brand home-brand--button"
          type="button"
          onClick={onGoHome}
          aria-label="CampusEcom — Về trang chủ"
          title="Về trang chủ"
        >
          <span className="home-brand-mark" aria-hidden>
            C
          </span>

          <span className="home-brand-text">
            <strong>
              Campus<span>Ecom</span>
            </strong>

            <small>Student Community</small>
          </span>
        </button>

        <nav className="home-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={
                item.key === activeNavKey
                  ? "home-nav-link home-nav-link--active"
                  : "home-nav-link"
              }
              type="button"
              onClick={item.onClick}
              aria-current={
                item.key === activeNavKey ? "page" : undefined
              }
            >
              <HomeIcon name={item.icon} size={17} />

              <span>{item.label}</span>

              {item.badge === "messenger" && hasUnread && (
                <span className="home-nav-badge">
                  {Number(unreadCount) > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="home-account">

          <button
            className="home-account-user"
            type="button"
            onClick={onViewProfile}
            title="Xem hồ sơ cá nhân"
          >
            <span className="home-avatar" aria-hidden>
              {avatarUrl ? (
                <img
                  className="home-avatar-img"
                  src={avatarUrl}
                  alt=""
                  loading="lazy"
                />
              ) : (
                initials
              )}
            </span>

            <span className="home-account-meta">
              <strong>{fullName}</strong>

              <small>{email}</small>
            </span>
          </button>

          <button
            className="home-btn home-btn--ghost"
            type="button"
            onClick={onViewProfile}
          >
            Hồ sơ
          </button>

          <button
            className="home-btn home-btn--danger"
            type="button"
            onClick={onLogout}
          >
            <HomeIcon name="logout" size={15} />

            <span>Đăng xuất</span>
          </button>

        </div>

      </div>

    </header>
  );
}