export default function HomePage({
  user,
  onLogout,
  onViewProfile,
  onSetupPreferences,
  onViewMyPosts,
  onOpenMatching,
  onOpenLostFound,
}) {
  const fullName =
    user?.fullName ??
    user?.FullName ??
    "Sinh viên";

  const email =
    user?.email ??
    user?.Email ??
    "";

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">

        <div className="home-logo">
          <div className="home-logo-icon">
            C
          </div>

          <div>
            <strong>
              Campus<span>Ecom</span>
            </strong>

            <small>
              Student Community
            </small>
          </div>
        </div>

        <div className="home-user">

          <div className="home-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div className="home-user-info">
            <strong>{fullName}</strong>
            <span>{email}</span>
          </div>

          <button
            className="home-logout"
            onClick={onLogout}
          >
            Đăng xuất
          </button>

        </div>

      </header>


      {/* MAIN */}
      <main className="home-main">

        <section className="home-hero">

          <span className="eyebrow">
            CAMPUS LIFE, CONNECTED
          </span>

          <h1>
            Xin chào,{" "}
            <span>{fullName}</span> 👋
          </h1>

          <p>
            Chào mừng bạn đến với CampusEcomSystemMini.
            Đây là trang chủ của hệ thống Student & Campus Utility.
          </p>

        </section>


        {/* FEATURE CARDS */}
        <section className="home-features">

          <div className="home-card">

            <div className="home-card-icon">
              👤
            </div>

            <h3>
              Hồ sơ cá nhân
            </h3>

            <p>
              Quản lý thông tin cá nhân,
              số điện thoại và tài khoản.
            </p>

            <button
              className="text-button"
              type="button"
              onClick={onViewProfile}
            >
              Xem hồ sơ
            </button>

          </div>


          <div className="home-card">

            <div className="home-card-icon">
              📝
            </div>

            <h3>
              Bài đăng của tôi
            </h3>

            <p>
              Quản lý các bài đăng,
              tìm kiếm và chia sẻ thông tin.
            </p>

            <button
              type="button"
              onClick={onViewMyPosts}
            >
              Xem bài đăng
            </button>

          </div>


          <div className="home-card">

            <div className="home-card-icon">
              🎯
            </div>

            <h3>
              Vector nhu cầu
            </h3>

            <p>
              Thiết lập sở thích để hỗ trợ
              tính năng Smart Matching.
            </p>

            <button
              type="button"
              onClick={onSetupPreferences}
            >
              Thiết lập
            </button>

          </div>


          <div className="home-card">

            <div className="home-card-icon">
              💬
            </div>

            <h3>
              Tin nhắn
            </h3>

            <p>
              Kết nối và trò chuyện với
              những sinh viên khác.
            </p>

            <button>
              Mở Messenger
            </button>

          </div>

        </section>


        {/* MODULES */}
        <section className="home-section">

          <div className="section-heading">

            <span className="eyebrow">
              CAMPUS UTILITY
            </span>

            <h2>
              Khám phá các tiện ích
            </h2>

          </div>


          <div className="module-grid">

            <div className="module-card module-card--active">
              <span>01</span>
              <h3>
                Smart Matching
              </h3>
              <p>
                Tìm nhóm học tập và phòng trọ
                phù hợp.
              </p>

              <button
                className="module-card-action"
                type="button"
                onClick={onOpenMatching}
              >
                Tìm nhóm học
              </button>
            </div>

            <div className="module-card module-card--active">
              <span>02</span>
              <h3>
                Lost & Found
              </h3>
              <p>
                Tìm kiếm và trả lại đồ thất lạc.
              </p>

              <button
                className="module-card-action"
                type="button"
                onClick={onOpenLostFound}
              >
                Xem đồ thất lạc
              </button>
            </div>

            <div className="module-card">
              <span>03</span>
              <h3>
                Academic Library
              </h3>
              <p>
                Chia sẻ tài liệu và giáo trình.
              </p>
            </div>

            <div className="module-card">
              <span>04</span>
              <h3>
                Gamification
              </h3>
              <p>
                Tích điểm và tham gia bảng xếp hạng.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="home-footer">
        CampusEcomSystemMini · Student & Campus Utility
      </footer>

    </div>
  );
}