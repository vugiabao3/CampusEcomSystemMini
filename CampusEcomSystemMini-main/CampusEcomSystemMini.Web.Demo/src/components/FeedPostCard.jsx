import HomeIcon from "./home/HomeIcon.jsx";
import { getInitials } from "./home/initials.js";
import ConnectionRequestButton from "./ConnectionRequestButton.jsx";
import { getPostTypeLabel } from "./postTypes.js";
import { formatPostDate } from "./postFormat.js";

function getText(post, key) {
  return post?.[key] ?? "";
}

// Một thẻ bài đăng trong feed cộng đồng, bố cục gần giống
// một nhóm Facebook: avatar + tên người đăng ở trên, nội dung ở giữa,
// hành động (thích / xem chi tiết / sửa / xóa) ở dưới.
//
// Dữ liệu lấy từ GET /api/posts, nút thích dùng lại
// POST/DELETE /api/posts/{id}/like, xem chi tiết mở lại
// PostDetailModal sẵn có.
export default function FeedPostCard({
  post,
  isOwner,
  likeInfo,
  liking,
  onToggleLike,
  onOpenDetail,
  onEdit,
  onDelete,
  onReport,
  currentUserId = "",
  connectionRequests = [],
  connectionSendingId,
  onRequestConnection,
}) {
  const title = getText(post, "title");
  const content = getText(post, "content");
  const authorName =
    getText(post, "authorName") || "Sinh viên CampusEcom";

  const authorAvatarUrl = getText(post, "authorAvatarUrl");

  const likeCount = Number(likeInfo?.count ?? 0);
  const likedByMe = Boolean(likeInfo?.likedByMe);

  return (
    <article className="feed-card">

      <header className="feed-card-head">

        <span className="feed-avatar" aria-hidden>
          {authorAvatarUrl ? (
            <img
              className="feed-avatar-img"
              src={authorAvatarUrl}
              alt=""
              loading="lazy"
            />
          ) : (
            getInitials(authorName)
          )}
        </span>

        <div className="feed-author">

          <div className="feed-author-line">
            <strong className="feed-author-name">
              {authorName}
            </strong>

            {isOwner && (
              <span className="feed-owner-badge">
                Bài của bạn
              </span>
            )}
          </div>

          <div className="feed-meta">
            <time
              className="feed-time"
              dateTime={getText(post, "createdAt")}
            >
              {formatPostDate(getText(post, "createdAt"))}
            </time>

            <span className="feed-meta-dot" aria-hidden>
              ·
            </span>

            <span className="feed-type">
              {getPostTypeLabel(getText(post, "type"))}
            </span>
          </div>

        </div>

        <HomeIcon name="compass" size={18} className="feed-card-mark" />

      </header>

      {title && (
        <h2 className="feed-card-title">
          {title}
        </h2>
      )}

      {content && (
        <p className="feed-card-content">
          {content}
        </p>
      )}

      <footer className="feed-card-actions">

        <button
          type="button"
          className={
            likedByMe
              ? "feed-action feed-action--like feed-like--active"
              : "feed-action feed-action--like"
          }
          onClick={() => onToggleLike(post.id)}
          disabled={liking}
          aria-pressed={likedByMe}
        >
          <HomeIcon
            name={likedByMe ? "heartFilled" : "heart"}
            size={17}
          />

          <span>
            {likeCount > 0 ? `${likeCount} lượt thích` : "Thích"}
          </span>
        </button>

        <button
          className="feed-action"
          type="button"
          onClick={() => onOpenDetail(post.id)}
        >
          <HomeIcon name="chat" size={17} />

          <span>Xem chi tiết</span>
        </button>

        {!isOwner && onRequestConnection && (
          <ConnectionRequestButton
            post={post}
            currentUserId={currentUserId}
            requests={connectionRequests}
            sendingId={connectionSendingId}
            onRequest={onRequestConnection}
          />
        )}

        {!isOwner && onReport && (
          <button
            className="feed-action"
            type="button"
            onClick={() => onReport(post)}
          >
            <HomeIcon name="flag" size={17} />

            <span>Báo cáo</span>
          </button>
        )}

        {isOwner && (
          <>
            <button
              className="feed-action"
              type="button"
              onClick={() => onEdit(post)}
            >
              <HomeIcon name="pencil" size={17} />

              <span>Sửa</span>
            </button>

            <button
              className="feed-action feed-action--danger"
              type="button"
              onClick={() => onDelete(post)}
            >
              <HomeIcon name="trash" size={17} />

              <span>Xóa</span>
            </button>
          </>
        )}

      </footer>

    </article>
  );
}