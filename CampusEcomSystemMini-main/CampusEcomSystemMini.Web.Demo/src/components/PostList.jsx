import { getPostTypeLabel } from "./postTypes.js";
import { formatPostDate } from "./postFormat.js";

function getText(post, key) {
  const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  return post?.[pascalKey] ?? post?.[camelKey] ?? "";
}

function getPostId(post) {
  return getText(post, "id");
}

// Danh sách bài đăng dùng chung cho trang "Tất cả bài đăng"
// và trang "Bài đăng của tôi" và "Lịch sử đã thích".
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
        const authorName = getText(post, "authorName");
        const authorAvatarUrl = getText(post, "authorAvatarUrl");
        const postId = getPostId(post);
        const isOwner =
          Boolean(currentUserId) &&
          String(ownerId).toLowerCase() ===
            String(currentUserId).toLowerCase();

        const likeInfo = postLikes?.[postId];

        return (
          <article className="post-card" key={postId}>
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
                {formatPostDate(getText(post, "createdAt"))}
              </time>
            </header>

            {authorName && (
              <div className="post-author">
                {authorAvatarUrl && (
                  <img
                    className="post-author-avatar"
                    src={authorAvatarUrl}
                    alt=""
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="post-author-name">{authorName}</span>
              </div>
            )}

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
                onClick={() => onToggleLike(postId)}
                disabled={likingPostId === postId}
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
                onClick={() => onOpenDetail(postId)}
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