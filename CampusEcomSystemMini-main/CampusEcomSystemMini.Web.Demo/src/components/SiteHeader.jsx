// Header dùng chung cho các trang con (Smart Matching, Lost & Found,
// Library, Messenger, Bài đăng, Hồ sơ, Bảng xếp hạng, Preferences...)
// và cho trang Đăng nhập / Đăng ký.
//
// Trang chủ và trang "Tất cả bài đăng" dùng CampusHeader vì có nav
// đầy đủ. Các trang còn lại dùng SiteHeader này — cùng một brand,
// cùng một quy tắc: bấm logo "CampusEcom" luôn về Trang chủ.
//
// `onGoHome` bị bỏ trống ở trang Đăng nhập / Đăng ký vì người chưa
// đăng nhập chưa có Trang chủ để quay về — lúc đó brand hiển thị
// dạng chữ, không bấm được, tránh rơi vào màn hình trống.

function BrandContent() {
  return (
    <>
      <span className="brand-icon">
        C
      </span>

      <span>
        Campus
        <span className="brand-highlight">
          Ecom
        </span>
      </span>
    </>
  );
}

import { isDemoMode } from "../services/authService";

export default function SiteHeader({
  onGoHome,
  onLogout,
  label = "STUDENT COMMUNITY",
}) {
  return (
    <>
      {isDemoMode() && (
        <div style={{ background: "#fff3cd", color: "#664d03", padding: "4px 12px", fontSize: "12px", textAlign: "center" }}>
          DEMO MODE — Demo account – data is stored locally in this browser.
        </div>
      )}
      <header className="site-header">

      {onGoHome ? (
        <button
          className="brand brand--button"
          type="button"
          onClick={onGoHome}
          aria-label="CampusEcom — Về trang chủ"
          title="Về trang chủ"
        >
          <BrandContent />
        </button>
      ) : (
        <div className="brand">
          <BrandContent />
        </div>
      )}

      <span className="header-label">
        {label}
      </span>

      {onLogout && (
        <button
          className="btn btn--ghost btn-sm header-logout"
          type="button"
          onClick={onLogout}
          aria-label="Đăng xuất"
          title="Đăng xuất"
        >
          Đăng xuất
        </button>
      )}

    </header>
    </>
  );
}