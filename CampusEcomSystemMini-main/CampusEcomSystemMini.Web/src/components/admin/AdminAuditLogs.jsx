// AdminAuditLogs.jsx — Nhật ký kiểm tra Admin (MODULE_6 / BATCH 4)
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

function getActionLabel(action) {
  const labels = {
    BlockUser: "Khóa người dùng",
    UnblockUser: "Mở khóa người dùng",
    ApproveReport: "Duyệt báo cáo",
    RejectReport: "Từ chối báo cáo",
    HidePost: "Ẩn bài đăng",
    RestorePost: "Khôi phục bài đăng",
    DeletePost: "Xóa bài đăng",
  };

  return labels[action] || action;
}

function getActionClass(action) {
  if (action === "BlockUser" || action === "DeletePost" || action === "HidePost")
    return "audit-action audit-action--danger";
  if (action === "UnblockUser" || action === "RestorePost")
    return "audit-action audit-action--success";
  return "audit-action audit-action--neutral";
}

export default function AdminAuditLogs({
  logs,
  loading,
  error,
  onBack,
}) {
  if (loading && !logs) {
    return (
      <div className="posts-state">
        Đang tải nhật ký kiểm tra...
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

  if (!logs || logs.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        <span className="posts-state-icon">📜</span>

        <h3 className="posts-state-title">Không có nhật ký</h3>

        <p className="posts-state-text">
          Chưa có hành động quản trị nào được ghi lại.
        </p>
      </div>
    );
  }

  return (
    <section className="pref-card admin-audit-logs">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">ADMIN HUB</span>

          <h1 className="pref-title">Nhật ký kiểm tra</h1>

          <p className="pref-subtitle">
            Ghi lại hành động của quản trị viên
          </p>
        </div>

        <BackButton onClick={onBack} />
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Admin</th>
              <th>Hành động</th>
              <th>Loại đối tượng</th>
              <th>Mã đối tượng</th>
              <th>Giá trị cũ</th>
              <th>Giá trị mới</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="audit-time">{formatDate(log.createdAt)}</td>
                <td className="audit-actor">{log.actorId?.slice(0, 8)}...</td>
                <td>
                  <span className={getActionClass(log.action)}>
                    {getActionLabel(log.action)}
                  </span>
                </td>
                <td className="audit-entity-type">{log.entityType}</td>
                <td className="audit-entity-id">{log.entityId?.slice(0, 8)}...</td>
                <td className="audit-values">{log.oldValues || "—"}</td>
                <td className="audit-values">{log.newValues || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="posts-toolbar">
        <BackButton onClick={onBack} />
      </div>
    </section>
  );
}
