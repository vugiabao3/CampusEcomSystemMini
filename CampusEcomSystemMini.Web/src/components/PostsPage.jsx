import PostList from "./PostList.jsx";
import PostFormModal from "./PostFormModal.jsx";
import PostDetailModal from "./PostDetailModal.jsx";

// Trang bài đăng.
// mode = "all"  => GET /api/posts
// mode = "mine" => GET /api/posts/me
export default function PostsPage({
  mode,
  posts,
  user,
  loading,
  saving,
  error,
  success,
  formOpen,
  formPost,
  detailOpen,
  detailPost,
  detailLoading,
  detailError,
  postLikes,
  likingPostId,
  onCreate,
  onEdit,
  onDelete,
  onToggleLike,
  onSubmitPost,
  onOpenDetail,
  onCloseForm,
  onCloseDetail,
  onSwitchMode,
  onBack,
}) {
  const isMine = mode === "mine";

  const currentUserId = user?.id ?? user?.Id ?? "";

  const isDetailOwner =
    Boolean(currentUserId) &&
    String(detailPost?.userId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();

  return (
    <section className="pref-card posts-card">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">
            {isMine ? "QUẢN LÝ CÁ NHÂN" : "CAMPUS COMMUNITY"}
          </span>

          <h1 className="pref-title">
            {isMine ? "Bài đăng của tôi" : "Bài đăng"}
          </h1>

          <p className="pref-subtitle">
            {isMine
              ? "Quản lý các bài đăng bạn đã đăng trên campus."
              : "Xem các thông tin được chia sẻ trong khuôn viên trường."}
          </p>
        </div>

        <div className="posts-head-actions">
          <span className="pref-status pref-status--ready">
            {posts?.length ?? 0} bài đăng
          </span>

          <button
            className="btn btn-primary posts-primary-btn"
            type="button"
            onClick={onCreate}
            disabled={saving}
          >
            Đăng bài mới
          </button>
        </div>
      </div>

      {error && !formOpen && !detailOpen && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {success && !formOpen && !detailOpen && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onSwitchMode}
        >
          {isMine
            ? "Xem tất cả bài đăng"
            : "Xem bài đăng của tôi"}
        </button>

        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      <PostList
        posts={posts}
        currentUserId={currentUserId}
        loading={loading}
        postLikes={postLikes}
        likingPostId={likingPostId}
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleLike={onToggleLike}
      />

      {formOpen && (
        <PostFormModal
          key={formPost ? formPost.id : "new"}
          post={formPost}
          saving={saving}
          error={error}
          onSubmit={onSubmitPost}
          onClose={onCloseForm}
        />
      )}

      {detailOpen && (
        <PostDetailModal
          post={detailPost}
          loading={detailLoading}
          error={detailError}
          isOwner={isDetailOwner}
          likeInfo={postLikes?.[detailPost?.id]}
          liking={Boolean(detailPost) && likingPostId === detailPost.id}
          onToggleLike={onToggleLike}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onCloseDetail}
        />
      )}
    </section>
  );
}