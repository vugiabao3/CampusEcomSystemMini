import { useEffect } from "react";

import BackButton from "./BackButton.jsx";
import PostList from "./PostList.jsx";
import PostDetailModal from "./PostDetailModal.jsx";

// Trang "Lịch sử đã thích" - hiển thị các bài đăng mà người dùng đã thích.
export default function LikedPostsPage({
  likedPosts,
  likedPostsLoading,
  likedPostsError,
  currentUserId,
  onBack,
  onOpenDetail,
  onToggleLike,
  postLikes,
  likingPostId,
  onRefresh,
  detailOpen,
  detailPost,
  detailLoading,
  detailError,
  onCloseDetail,
}) {
  useEffect(() => {
    onRefresh?.();
  }, [onRefresh]);

  const isDetailOwner =
    Boolean(currentUserId) &&
    String(detailPost?.userId ?? detailPost?.UserId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();

  return (
    <section className="pref-card liked-posts-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">TÀI KHOẢN CỦA BẠN</span>

          <h1 className="pref-title">Lịch sử đã thích</h1>

          <p className="pref-subtitle">
            Các bài đăng bạn đã thích. Bấm vào bài đăng để xem chi tiết hoặc bỏ thích.
          </p>
        </div>
      </div>

      {likedPostsLoading && (
        <div className="posts-state">Đang tải lịch sử đã thích...</div>
      )}

      {likedPostsError && (
        <div className="message message-error" role="alert">
          {likedPostsError}
          <button
            type="button"
            className="btn btn--ghost"
            style={{ marginTop: "8px" }}
            onClick={onRefresh}
          >
            Thử lại
          </button>
        </div>
      )}

      {!likedPostsLoading && !likedPostsError && likedPosts && likedPosts.length === 0 && (
        <div className="posts-state posts-state--empty">
          Bạn chưa thích bài đăng nào.
        </div>
      )}

      {!likedPostsLoading && !likedPostsError && likedPosts && likedPosts.length > 0 && (
        <PostList
          posts={likedPosts.map((p) => ({
            id: p.postId ?? p.PostId,
            title: p.title ?? p.Title,
            content: p.content ?? p.Content,
            type: p.type ?? p.Type,
            createdAt: p.createdAt ?? p.CreatedAt,
            updatedAt: p.updatedAt ?? p.UpdatedAt,
            userId: p.userId ?? p.UserId,
            authorName: p.authorName ?? p.AuthorName,
            authorAvatarUrl: p.authorAvatarUrl ?? p.AuthorAvatarUrl,
          }))}
          currentUserId={currentUserId}
          loading={false}
          postLikes={postLikes}
          likingPostId={likingPostId}
          onOpenDetail={onOpenDetail}
          onToggleLike={onToggleLike}
        />
      )}

      <div className="pref-actions">
        <BackButton onClick={onBack} />
      </div>

      {detailOpen && (
        <PostDetailModal
          post={detailPost}
          loading={detailLoading}
          error={detailError}
          isOwner={isDetailOwner}
          likeInfo={postLikes?.[detailPost?.id ?? detailPost?.PostId ?? detailPost?.Id]}
          liking={Boolean(detailPost) && likingPostId === (detailPost?.id ?? detailPost?.PostId ?? detailPost?.Id)}
          onToggleLike={onToggleLike}
          onClose={onCloseDetail}
        />
      )}
    </section>
  );
}