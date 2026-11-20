import { useRef } from "react";

import CampusHeader from "./CampusHeader.jsx";
import HomeIcon from "./home/HomeIcon.jsx";
import { CAMPUS_NAV_ITEMS } from "./home/navItems.js";

// Trang chủ CampusEcomSystemMini — Student & Campus Utility.
//
// Trang này chỉ tổng hợp điều hướng tới các trang đã có trong hệ thống.
// Không gọi API riêng, không giữ state nghiệp vụ ngoài phần cuộn tới
// khu vực "CAMPUS UTILITY".

// Thanh điều hướng trên cùng do CampusHeader render,
// danh sách mục nằm trong home/navItems.js và dùng chung
// với trang "Tất cả bài đăng".

// Khu vực truy cập nhanh — các tính năng cá nhân dùng thường xuyên.
const QUICK_ACCESS = [
  {
    index: "01",
    icon: "user",
    title: "Hồ sơ cá nhân",
    description:
      "Quản lý thông tin cá nhân, số điện thoại và tài khoản.",
    cta: "Xem hồ sơ",
    onClick: "onViewProfile",
  },
  {
    index: "02",
    icon: "posts",
    title: "Bài đăng của tôi",
    description:
      "Quản lý các bài đăng và chia sẻ thông tin với cộng đồng.",
    cta: "Xem bài đăng",
    onClick: "onViewMyPosts",
  },
  {
    index: "03",
    icon: "vector",
    title: "Vector nhu cầu",
    description:
      "Thiết lập sở thích để hỗ trợ Smart Matching.",
    cta: "Thiết lập",
    onClick: "onSetupPreferences",
  },
  {
    index: "04",
    icon: "chat",
    title: "Tin nhắn",
    description:
      "Kết nối và trò chuyện với những sinh viên khác.",
    cta: "Mở Messenger",
    onClick: "onOpenMessenger",
    badge: true,
  },
];

// CAMPUS UTILITY — các module chính của dự án.
const MODULES = [
  {
    index: "01",
    category: "MODULE 2",
    icon: "sparkles",
    title: "Smart Matching",
    description:
      "Tìm nhóm học tập và phòng trọ phù hợp.",
    cta: "Tìm nhóm học",
    onClick: "onOpenMatching",
  },
  {
    index: "02",
    category: "MODULE 3",
    icon: "lostFound",
    title: "Lost & Found",
    description:
      "Tìm kiếm và trả lại đồ thất lạc.",
    cta: "Xem đồ thất lạc",
    onClick: "onOpenLostFound",
  },
  {
    index: "03",
    category: "MODULE 4",
    icon: "book",
    title: "Academic Library",
    description:
      "Đổi sách giáo trình và chia sẻ tài liệu.",
    cta: "Sàn đổi sách",
    onClick: "onOpenLibrary",
  },
];

// Toàn cảnh hệ thống — chỉ giới thiệu, không gắn hành động.
const ECOSYSTEM = [
  {
    index: "1",
    icon: "shield",
    title: "Authentication & User Profile",
    description:
      "Đăng nhập JWT, hồ sơ cá nhân và vector nhu cầu làm nền tảng cho các module sau.",
    state: "active",
  },
  {
    index: "2",
    icon: "sparkles",
    title: "Smart Matching",
    description:
      "Gợi ý nhóm học tập và phòng trọ bằng Cosine Similarity trên vector nhu cầu.",
    state: "active",
  },
  {
    index: "3",
    icon: "lostFound",
    title: "Lost & Found",
    description:
      "Báo mất đồ, báo nhặt được và xác minh chủ sở hữu bằng câu hỏi bí mật.",
    state: "active",
  },
  {
    index: "4",
    icon: "book",
    title: "Academic Library & Exchange",
    description:
      "Sàn đổi sách giáo trình, ghép chuỗi đổi sách và kho tài liệu số.",
    state: "active",
  },
  {
    index: "5",
    icon: "bell",
    title: "Mini Messenger & Notification",
    description:
      "Kết nối bạn bè, trò chuyện realtime và thông báo từ các module khác.",
    state: "active",
  },
];


export default function HomePage({
  user,
  onLogout,
  onGoHome,
  onViewProfile,
  onSetupPreferences,
  onViewMyPosts,
  onOpenAllPosts,
  onOpenMatching,
  onOpenLostFound,
    onOpenMessenger,
    onOpenLibrary,
    unreadCount = 0,
}) {
  // Dùng để cuộn tới khu vực CAMPUS UTILITY khi bấm CTA trong hero.
  const utilityRef = useRef(null);

  const fullName =
    user?.fullName ??
    user?.FullName ??
    "Sinh viên";

  // Gom các handler vào một object để các mảng dữ liệu chỉ
  // cần khai báo tên hàm, không truyền closure vào từng thẻ.
  const actions = {
    onOpenMatching,
    onOpenLostFound,
    onOpenLibrary,
    onOpenMessenger,
    onOpenAllPosts,
    onViewProfile,
    onViewMyPosts,
    onSetupPreferences,
  };

  const hasUnread = Number(unreadCount) > 0;

  function handleScrollToUtility() {
    utilityRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="home-page">

      {/* ================= HEADER ================= */}

      <CampusHeader
        user={user}
        unreadCount={unreadCount}
        activeNavKey="home"
        navItems={CAMPUS_NAV_ITEMS.map((item) => ({
          ...item,
          onClick: actions[item.onClick],
        }))}
        onGoHome={onGoHome}
        onViewProfile={onViewProfile}
        onLogout={onLogout}
      />


      <main className="home-main">

        {/* ================= HERO ================= */}

        <section className="home-hero">

          <div className="home-hero-glow" aria-hidden />

          <span className="eyebrow">
            CAMPUS LIFE, CONNECTED
          </span>

          <h1>
            Xin chào,{" "}
            <span>{fullName}</span> 👋
          </h1>

          <p className="home-hero-lead">
            Chào mừng bạn đến với CampusEcomSystemMini —
            nền tảng tiện ích dành cho sinh viên. Tập trung mọi nhu cầu
            học tập, tìm bạn bè và trao đổi tài liệu trong một nơi duy nhất.
          </p>

          <p className="home-hero-note">
            Sàn đổi sách, tìm nhóm học, tìm đồ thất lạc đều dùng chung một tài khoản sinh viên.
          </p>

          <div className="home-hero-actions">
            <button
              className="home-btn home-btn--primary"
              type="button"
              onClick={handleScrollToUtility}
            >
              Khám phá tiện ích

              <HomeIcon name="arrowRight" size={16} />
            </button>

            <button
              className="home-btn home-btn--outline"
              type="button"
              onClick={onViewProfile}
            >
              Xem hồ sơ
            </button>
          </div>

          <ul className="home-hero-stats">
            <li>
              <strong>06</strong>
              <span>Module tích hợp</span>
            </li>

            <li>
              <strong>04</strong>
              <span>Tiện ích chính</span>
            </li>

            <li>
              <strong>01</strong>
              <span>Tài khoản sinh viên</span>
            </li>
          </ul>

        </section>


        {/* ================= QUICK ACCESS ================= */}

        <section className="home-section">

          <div className="section-heading">

            <span className="eyebrow">
              QUICK ACCESS
            </span>

            <h2>
              Truy cập nhanh
            </h2>

            <p>
              Các tính năng cá nhân bạn dùng thường xuyên, gom lại
              một chỗ để không phải tìm trong từng menu.
            </p>

          </div>

          <div className="home-features">

            {QUICK_ACCESS.map((item) => (
              <article className="home-card" key={item.index}>

                <div className="home-card-head">
                  <span className="home-card-icon" aria-hidden>
                    <HomeIcon name={item.icon} size={20} />
                  </span>

                  <span className="home-card-index">
                    {item.index}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button
                  className="home-card-action"
                  type="button"
                  onClick={actions[item.onClick]}
                >
                  {item.cta}

                  <HomeIcon name="arrowRight" size={14} />

                  {item.badge && hasUnread && (
                    <span className="home-card-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

              </article>
            ))}

          </div>

        </section>


        {/* ================= CAMPUS UTILITY ================= */}

        <section className="home-section" ref={utilityRef}>

          <div className="section-heading">

            <span className="eyebrow">
              CAMPUS UTILITY
            </span>

            <h2>
              Khám phá các tiện ích
            </h2>

            <p>
              Bốn module được sử dụng nhiều nhất trong CampusEcomSystemMini.
            </p>

          </div>

          <div className="home-modules">

            {MODULES.map((item) => (
              <article
                className="home-module"
                key={item.index}
              >
                <div className="home-module-top">
                  <span className="home-module-category">
                    {item.category}
                  </span>

                  <span className="home-module-icon" aria-hidden>
                    <HomeIcon name={item.icon} size={19} />
                  </span>
                </div>

                <span className="home-module-index">
                  {item.index}
                </span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button
                  className="home-module-action"
                  type="button"
                  onClick={actions[item.onClick]}
                >
                  {item.cta}

                  <HomeIcon name="arrowRight" size={14} />
                </button>

              </article>
            ))}

          </div>

        </section>


        {/* ================= ECOSYSTEM ================= */}

        <section className="home-section">

          <div className="section-heading">

            <span className="eyebrow">
              HỆ SINH THÁI HỆ THỐNG
            </span>

            <h2>
              Sáu module, một hệ thống
            </h2>

            <p>
              CampusEcomSystemMini là một Student &amp; Campus Utility
              tích hợp: dữ liệu hồ sơ và vector nhu cầu của bạn được dùng
              lại xuyên suốt các module.
            </p>

          </div>

          <div className="ecosystem-grid">

            {ECOSYSTEM.map((item) => (
              <article
                className="ecosystem-card"
                key={item.index}
              >
                <span className="ecosystem-card-index">
                  {item.index}
                </span>

                <span className="ecosystem-card-icon" aria-hidden>
                  <HomeIcon name={item.icon} size={18} />
                </span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <span className="ecosystem-card-state">
                  <HomeIcon name="compass" size={13} />

                  Đã tích hợp
                </span>
              </article>
            ))}

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-footer-inner">

          <div className="home-footer-brand">
            <strong>
              Campus<span>Ecom</span>SystemMini
            </strong>

            <p>
              Student &amp; Campus Utility — nền tảng tiện ích
              dành cho sinh viên, gồm tài khoản, smart matching,
              lost &amp; found, thư viện và messenger.
            </p>
          </div>

          <nav
            className="home-footer-links"
            aria-label="Liên kết tiện ích"
          >
            <span className="home-footer-label">
              TIỆN ÍCH
            </span>

            <button
              className="home-footer-link"
              type="button"
              onClick={onOpenAllPosts}
            >
              Tất cả bài đăng
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onOpenMatching}
            >
              Smart Matching
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onOpenLostFound}
            >
              Lost &amp; Found
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onOpenLibrary}
            >
              Academic Library
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onOpenMessenger}
            >
              Mini Messenger
            </button>
          </nav>

          <div className="home-footer-note">
            <span className="home-footer-label">
              TÀI KHOẢN
            </span>

            <button
              className="home-footer-link"
              type="button"
              onClick={onViewProfile}
            >
              Hồ sơ cá nhân
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onViewMyPosts}
            >
              Bài đăng của tôi
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onSetupPreferences}
            >
              Vector nhu cầu
            </button>

            <button
              className="home-footer-link"
              type="button"
              onClick={onLogout}
            >
              Đăng xuất
            </button>
          </div>

        </div>

        <div className="home-footer-bottom">
          CampusEcomSystemMini · Student &amp; Campus Utility
        </div>

      </footer>

    </div>
  );
}