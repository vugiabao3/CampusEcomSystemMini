import { getPostTypeLabel } from "./postTypes.js";

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Chi tiết một bài đăng, dữ liệu lấy từ GET /api/posts/{id}.
export default function PostDetailModal({
  post,
  loading,
  error,
  isOwner,
  likeInfo,
  liking,
  onToggleLike,
  onEdit,
  onDelete,
  onClose,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card--detail"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
        >
          ×
        </button>

        {loading && (
          <div className="posts-state">Đang tải bài đăng...</div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && post && (
          <>
            <div className="post-detail-head">
              <span className="post-type">
                {getPostTypeLabel(post.type)}
              </span>

              {isOwner && (
                <span className="post-owner-badge">Của bạn</span>
              )}

              <time className="post-date">
                {formatDate(post.createdAt)}
              </time>
            </div>

            <h2 className="post-detail-title">{post.title}</h2>

            <p className="post-detail-content">{post.content}</p>

            {post.updatedAt &&
              post.updatedAt !== post.createdAt && (
                <p className="post-detail-updated">
                  Cập nhật lần cuối: {formatDate(post.updatedAt)}
                </p>
              )}

            <div className="posts-actions">
              <button
                type="button"
                className={
                  likeInfo?.likedByMe
                    ? "btn btn--like btn--like-active"
                    : "btn btn--like"
                }
                onClick={() => onToggleLike(post.id)}
                disabled={liking}
                aria-pressed={Boolean(likeInfo?.likedByMe)}
              >
                {likeInfo?.likedByMe ? "♥" : "♡"}

                {likeInfo?.likedByMe
                  ? `Đã thích (${likeInfo.count})`
                  : `Thích (${likeInfo?.count ?? 0})`}
              </button>

              {isOwner && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onEdit(post)}
                  >
                    Sửa bài đăng
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => onDelete(post)}
                  >
                    Xóa bài đăng
                  </button>
                </>
              )}

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}