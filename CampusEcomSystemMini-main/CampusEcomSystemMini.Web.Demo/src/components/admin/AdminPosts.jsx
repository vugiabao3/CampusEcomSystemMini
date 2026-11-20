// AdminPosts.jsx — Quản lý bài đăng Admin (MODULE_6 / BATCH 4)
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

function getTypeLabel(type) {
  if (type === "Buy") return "Mua";
  if (type === "Sell") return "Bán";
  if (type === "Exchange") return "Trao đổi";
  if (type === "Donate") return "Tặng";
  return type || "—";
}

function getStatusLabel(status) {
  if (status === "Approved") return "Đã duyệt";
  if (status === "Pending") return "Chờ duyệt";
  if (status === "Rejected") return "Đã từ chối";
  return status || "—";
}

function getStatusClass(status) {
  if (status === "Approved") return "post-status post-status--approved";
  if (status === "Pending") return "post-status post-status--pending";
  if (status === "Rejected") return "post-status post-status--rejected";
  return "post-status";
}

export default function AdminPosts({
  posts,
  loading,
  error,
  page,
  pageSize,
  totalPages,
  type,
  status,
  search,
  onTypeChange,
  onStatusChange,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onToggleHidden,
  onDelete,
  onBack,
}) {
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [localType, setLocalType] = useState(type ?? "");
  const [localStatus, setLocalStatus] = useState(status ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  function handleTypeChange(e) {
    const value = e.target.value;
    setLocalType(value);
    onTypeChange(value);
  }

  function handleStatusChange(e) {
    const value = e.target.value;
    setLocalStatus(value);
    onStatusChange(value);
  }

  if (loading && !posts) {
    return (
      <div className="posts-state">
        Đang tải danh sách bài đăng...
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

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        <span className="posts-state-icon">📝</span>

        <h3 className="posts-state-title">Không có bài đăng</h3>

        <p className="posts-state-text">
          Không tìm thấy bài đăng phù hợp.
        </p>
      </div>
    );
  }

  return (
    <section className="pref-card admin-posts">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">ADMIN HUB</span>

          <h1 className="pref-title">Quản lý bài đăng</h1>

          <p className="pref-subtitle">
            Xem và xóa bài đăng vi phạm
          </p>
        </div>

        <BackButton onClick={onBack} />
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tiêu đề..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={localType}
            onChange={handleTypeChange}
          >
            <option value="">Tất cả loại</option>
            <option value="Buy">Mua</option>
            <option value="Sell">Bán</option>
            <option value="Exchange">Trao đổi</option>
            <option value="Donate">Tặng</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={localStatus}
            onChange={handleStatusChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Rejected">Đã từ chối</option>
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
              <th>Mã bài đăng</th>
              <th>Tiêu đề</th>
              <th>Người đăng</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Ẩn</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="post-id">{post.id?.slice(0, 8)}...</td>
                <td className="post-title">{post.title || "—"}</td>
                <td>{post.userId?.slice(0, 8)}...</td>
                <td>
                  <span className="type-badge">{getTypeLabel(post.type)}</span>
                </td>
                <td>
                  <span className={getStatusClass(post.status)}>
                    {getStatusLabel(post.status)}
                  </span>
                </td>
                <td>{formatDate(post.createdAt)}</td>
                <td>
                  <span className={`hidden-badge ${post.isHidden ? "hidden-badge--yes" : "hidden-badge--no"}`}>
                    {post.isHidden ? "Đã ẩn" : "Hiển thị"}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn-sm"
                      onClick={() => onViewDetail(post)}
                    >
                      Xem chi tiết
                    </button>

                    <button
                      type="button"
                      className={`btn btn--ghost btn-sm ${post.isHidden ? "btn-success" : "btn-warning"}`}
                      onClick={() => {
                        const confirmMsg = post.isHidden
                          ? "Khôi phục bài đăng này?"
                          : "Ẩn bài đăng này?";

                        if (!window.confirm(confirmMsg)) {
                          return;
                        }

                        let reason = null;

                        if (!post.isHidden) {
                          reason = window.prompt("Nhập lý do ẩn bài đăng:");
                          if (reason === null) {
                            return;
                          }
                        }

                        onToggleHidden(post.id, reason);
                      }}
                    >
                      {post.isHidden ? "Khôi phục" : "Ẩn"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm("Xóa bài đăng này?")) {
                          onDelete(post.id);
                        }
                      }}
                    >
                      Xóa
                    </button>
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