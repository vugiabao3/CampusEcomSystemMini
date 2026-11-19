// AdminUsers.jsx — Quản lý người dùng Admin (MODULE_6 / BATCH 4)
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

function getRoleLabel(role) {
  return role === "Admin" ? "Quản trị viên" : "Người dùng";
}

function getStatusLabel(status) {
  return status === "Active" ? "Hoạt động" : "Đã khóa";
}

function getStatusClass(status) {
  return status === "Active"
    ? "user-status user-status--active"
    : "user-status user-status--blocked";
}

export default function AdminUsers({
  users,
  loading,
  error,
  page,
  pageSize,
  totalPages,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onIssueWarning,
  onSuspendUser,
  onReactivateUser,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onBack,
}) {
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [localStatus, setLocalStatus] = useState(status ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  function handleStatusChange(e) {
    const value = e.target.value;
    setLocalStatus(value);
    onStatusChange(value);
  }

  if (loading && !users) {
    return (
      <div className="posts-state">
        Đang tải danh sách người dùng...
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

  if (!users || users.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        <span className="posts-state-icon">👥</span>

        <h3 className="posts-state-title">Không có người dùng</h3>

        <p className="posts-state-text">
          Không tìm thấy người dùng phù hợp.
        </p>
      </div>
    );
  }

  return (
    <section className="pref-card admin-users">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">ADMIN HUB</span>

          <h1 className="pref-title">Quản lý người dùng</h1>

          <p className="pref-subtitle">
            Xem và thay đổi trạng thái tài khoản
          </p>
        </div>

        <BackButton onClick={onBack} />
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tên hoặc email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={localStatus}
            onChange={handleStatusChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Blocked">Đã khóa</option>
          </select>
        </div>
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
              <th>Mã người dùng</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-id">{user.id?.slice(0, 8)}...</td>
                <td>{user.fullName || "—"}</td>
                <td>{user.email || "—"}</td>
                <td>
                  <span className={`role-badge ${user.role === "Admin" ? "role-badge--admin" : ""}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className={getStatusClass(user.status)}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn-sm"
                      onClick={() => onViewDetail(user)}
                    >
                      Xem chi tiết
                    </button>

                    {user.status === "Active" || user.status === "Suspended" ? (
                      <>
                        <button
                          type="button"
                          className="btn btn--ghost btn-sm btn-warning"
                          onClick={() => onIssueWarning(user)}
                        >
                          Cảnh báo
                        </button>

                        <button
                          type="button"
                          className="btn btn--ghost btn-sm btn-danger"
                          onClick={() => onSuspendUser(user)}
                        >
                          {user.status === "Suspended"
                            ? "Khóa vĩnh viễn"
                            : "Khóa tạm"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--ghost btn-sm btn-success"
                        onClick={() => onReactivateUser(user)}
                      >
                        Khôi phục
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <select
          className="form-select form-select--sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>

        <div className="pagination-controls">
          <button
            type="button"
            className="btn btn--ghost btn-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Trước
          </button>

          <span className="pagination-info">
            Trang {page} / {totalPages || 1}
          </span>

          <button
            type="button"
            className="btn btn--ghost btn-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      <div className="posts-toolbar">
        <BackButton onClick={onBack} />
      </div>
    </section>
  );
}