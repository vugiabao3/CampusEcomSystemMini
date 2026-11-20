// AdminDashboard.jsx — Bảng điều khiển Admin (MODULE_6 / BATCH 4)
import { useState } from "react";

function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("vi-VN");
}

const SECTIONS = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: "📊",
    description: "Thống kê hệ thống",
  },
  {
    key: "violations",
    label: "Báo cáo vi phạm",
    icon: "🚨",
    description: "Duyệt và xử lý báo cáo",
  },
  {
    key: "content",
    label: "Quản lý nội dung",
    icon: "📝",
    description: "Xem, ẩn và xóa bài đăng",
  },
  {
    key: "users",
    label: "Quản lý người dùng",
    icon: "👥",
    description: "Khóa / mở khóa tài khoản",
  },
  {
    key: "statistics",
    label: "Thống kê chi tiết",
    icon: "📈",
    description: "Biểu đồ và phân tích",
  },
  {
    key: "audit-logs",
    label: "Nhật ký kiểm tra",
    icon: "📜",
    description: "Lịch sử hành động admin",
  },
];

export default function AdminDashboard({
  stats,
  loading,
  error,
  onBack,
  onOpenSection,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải thống kê...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message message-error" role="alert">
        {error}
      </div>
    );
  }

  const cards = [
    {
      label: "Tổng người dùng",
      value: formatNumber(stats?.totalUsers),
      icon: "👥",
      className: "stat-card--users",
    },
    {
      label: "Người dùng hoạt động",
      value: formatNumber(stats?.activeUsers),
      icon: "✅",
      className: "stat-card--active",
    },
    {
      label: "Tổng bài đăng",
      value: formatNumber(stats?.totalPosts),
      icon: "📝",
      className: "stat-card--posts",
    },
    {
      label: "Báo cáo chờ duyệt",
      value: formatNumber(stats?.pendingReports),
      icon: "⏳",
      className: "stat-card--pending",
    },
    {
      label: "Báo cáo đã xử lý",
      value: formatNumber(stats?.resolvedReports),
      icon: "✅",
      className: "stat-card--resolved",
    },
  ];

  return (
    <section className="pref-card admin-dashboard">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">ADMIN HUB</span>

          <h1 className="pref-title">Bảng điều khiển</h1>

          <p className="pref-subtitle">
            Thống kê tổng quan hệ thống
          </p>
        </div>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className={`stat-card ${card.className}`}>
            <span className="stat-card-icon">{card.icon}</span>

            <div className="stat-card-content">
              <span className="stat-card-label">{card.label}</span>

              <strong className="stat-card-value">
                {card.value}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-sections">
        <h2 className="admin-sections-title">Các mục quản trị</h2>

        <div className="admin-sections-grid">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              className="admin-section-card"
              onClick={() => onOpenSection?.(section.key)}
            >
              <span className="admin-section-icon">{section.icon}</span>

              <div className="admin-section-info">
                <span className="admin-section-label">{section.label}</span>
                <span className="admin-section-desc">{section.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}