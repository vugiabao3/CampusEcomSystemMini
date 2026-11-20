// AdminReports.jsx — Quản lý báo cáo Admin (MODULE_6 / BATCH 4)
import { useState, useEffect } from "react";
import BackButton from "../BackButton.jsx";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status) {
  if (status === "Approved") return "Đã duyệt";
  if (status === "Rejected") return "Đã từ chối";
  return "Đang chờ duyệt";
}

function getStatusClass(status) {
  if (status === "Approved") return "report-status report-status--approved";
  if (status === "Rejected") return "report-status report-status--rejected";
  return "report-status report-status--pending";
}

export default function AdminReports({
  reports,
  loading,
  error,
  status,
  onStatusChange,
  onViewDetail,
  onApprove,
  onReject,
  onBack,
}) {
  const [localStatus, setLocalStatus] = useState(status ?? "");

  function handleStatusChange(e) {
    const value = e.target.value;
    setLocalStatus(value);
    onStatusChange(value);
  }

  if (loading && !reports) {
    return (
      <div className="posts-state">
        Đang tải danh sách báo cáo...
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

  if (!reports || reports.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        <span className="posts-state-icon">📋</span>

        <h3 className="posts-state-title">Không có báo cáo</h3>

        <p className="posts-state-text">
          Không tìm thấy báo cáo phù hợp.
        </p>
      </div>
    );
  }

  return (
    <section className="pref-card admin-reports">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">ADMIN HUB</span>

          <h1 className="pref-title">Quản lý báo cáo</h1>

          <p className="pref-subtitle">
            Xử lý các báo cáo vi phạm từ người dùng
          </p>
        </div>

        <BackButton onClick={onBack} />
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <select
            className="form-select"
            value={localStatus}
            onChange={handleStatusChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Đang chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Đã từ chối</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <ul className="report-list-admin">
        {reports.map((report) => (
          <li key={report.id} className="report-item-admin">
            <div className="report-item-main">
              <div className="report-item-header">
                <span className="report-item-reason">
                  {report.reason || "—"}
                </span>

                <span className={getStatusClass(report.status)}>
                  {getStatusLabel(report.status)}
                </span>
              </div>

              <div className="report-item-meta">
                <span className="report-item-post">
                  Bài đăng: {report.postId?.slice(0, 8)}...
                </span>

                <span className="report-item-reporter">
                  Người báo cáo: {report.reporterId?.slice(0, 8)}...
                </span>

                <span className="report-item-time">
                  {formatDate(report.createdAt) || "—"}
                </span>
              </div>

              {report.description && (
                <p className="report-item-description">
                  {report.description}
                </p>
              )}
            </div>

            <div className="report-item-actions">
              {report.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => onApprove(report.id)}
                    disabled={loading}
                  >
                    Duyệt
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onReject(report.id)}
                    disabled={loading}
                  >
                    Từ chối
                  </button>
                </>
              )}

              <button
                type="button"
                className="btn btn--ghost btn-sm"
                onClick={() => onViewDetail(report)}
              >
                Xem chi tiết
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="posts-toolbar">
        <BackButton onClick={onBack} />
      </div>
    </section>
  );
}