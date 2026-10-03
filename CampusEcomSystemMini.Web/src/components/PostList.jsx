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

function getText(post, key) {
  return post?.[key] ?? "";
}

// Danh sách bài đăng dùng chung cho trang "Tất cả bài đăng"
// và trang "Bài đăng của tôi".
export default function PostList({
  posts,
  currentUserId,
  loading,
  postLikes,
  likingPostId,
  onOpenDetail,
  onEdit,
  onDelete,
  onToggleLike,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải bài đăng...
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa có bài đăng nào.
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => {
        const title = getText(post, "title");
        const content = getText(post, "content");
        const ownerId = getText(post, "userId");
        const isOwner =
          Boolean(currentUserId) &&
          String(ownerId).toLowerCase() ===
            String(currentUserId).toLowerCase();

        const likeInfo = postLikes?.[post.id];

        return (
          <article className="post-card" key={post.id}>
            <header className="post-card-head">
              <span className="post-type">
                {getPostTypeLabel(getText(post, "type"))}
              </span>

              {isOwner && (
                <span className="post-owner-badge">
                  Của bạn
                </span>
              )}

              <time className="post-date">
                {formatDate(getText(post, "createdAt"))}
              </time>
            </header>

            <h3 className="post-title">{title}</h3>

            <p className="post-excerpt">
              {content.length > 150
                ? `${content.slice(0, 150)}...`
                : content}
            </p>

            <footer className="post-card-actions">
              <button
                type="button"
                className={
                  likeInfo?.likedByMe
                    ? "post-like post-like--active"
                    : "post-like"
                }
                onClick={() => onToggleLike(post.id)}
                disabled={likingPostId === post.id}
                aria-pressed={Boolean(likeInfo?.likedByMe)}
              >
                <span aria-hidden="true">
                  {likeInfo?.likedByMe ? "♥" : "♡"}
                </span>

                {likeInfo?.count ?? 0}

                <span className="post-like-label">
                  {likeInfo?.likedByMe
                    ? "Đã thích"
                    : "Thích"}
                </span>
              </button>

              <button
                className="post-action post-action--view"
                type="button"
                onClick={() => onOpenDetail(post.id)}
              >
                Xem chi tiết
              </button>

              {isOwner && (
                <>
                  <button
                    className="post-action"
                    type="button"
                    onClick={() => onEdit(post)}
                  >
                    Sửa
                  </button>

                  <button
                    className="post-action post-action--delete"
                    type="button"
                    onClick={() => onDelete(post)}
                  >
                    Xóa
                  </button>
                </>
              )}
            </footer>
          </article>
        );
      })}
    </div>
  );
}