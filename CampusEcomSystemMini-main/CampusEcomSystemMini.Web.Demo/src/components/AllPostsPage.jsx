import CampusHeader from "./CampusHeader.jsx";
import BackButton from "./BackButton.jsx";
import FeedPostCard from "./FeedPostCard.jsx";
import PostFilters from "./PostFilters.jsx";
import PostDetailModal from "./PostDetailModal.jsx";
import ReportForm from "./reports/ReportForm.jsx";
import HomeIcon from "./home/HomeIcon.jsx";
import { createReport } from "../services/reportService.js";
import { CAMPUS_NAV_ITEMS } from "./home/navItems.js";
import { useEffect, useRef, useState } from "react";

// Trang "Tất cả bài đăng" — feed cộng đồng sinh viên.
//
// Dùng GET /api/posts (không dùng /api/posts/me) nên hiển thị
// bài đăng của TẤT CẢ người dùng. Bộ lọc nhóm nội dung, nút thích,
// modal tạo/sửa và modal chi tiết đều dùng lại sẵn có.
//
// Dùng chung CampusHeader + .home-page với Trang chủ để hai trang
// có cùng header và cùng design system.
export default function AllPostsPage({
  user,
  posts,
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
  unreadCount = 0,
  filters,
  currentUserId = "",
  connectionRequests = [],
  connectionSendingId,
  onRequestConnection,
  onFilterChange,
  onCreate,
  onEdit,
  onDelete,
  onToggleLike,
  onSubmitPost,
  onOpenDetail,
  onCloseForm,
  onCloseDetail,
  onGoHome,
  onViewProfile,
  onViewMyPosts,
  onOpenMatching,
  onOpenLostFound,
  onOpenLibrary,
  onOpenMessenger,
  onLogout,
  targetPostId,
  targetPostHighlight,
  onClearTargetPost,
}) {
  const actions = {
    // Đang đứng ở trang cộng đồng nên mục này không điều hướng.
    onOpenAllPosts: () => {},
    onOpenMatching,
    onOpenLostFound,
    onOpenLibrary,
    onOpenMessenger,
  };

  const list = posts ?? [];

  const isDetailOwner =
    Boolean(currentUserId) &&
    String(detailPost?.userId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();

  const filterCount =
    (filters?.type ? 1 : 0) + (filters?.time ? 1 : 0);

  const postRefs = useRef({});
  const [highlightedPostId, setHighlightedPostId] = useState(null);

  // Report dialog state.
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPost, setReportPost] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(null);

  // Back to Top: hiển thị nút khi cuộn xuống, quay về đầu feed.
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setShowBackToTop(y > 300);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Kiểm tra trạng thái ban đầu (tránh hiển thị nút khi mount giữa màn hình).
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReport = (post) => {
    setReportPost(post);
    setReportOpen(true);
    setReportError(null);
    setReportSuccess(null);
  };

  const handleReportSubmit = async (reason, description) => {
    if (!reportPost) return;

    setReportSubmitting(true);
    setReportError(null);
    setReportSuccess(null);

    try {
      await createReport(reportPost.id, reason, description);
      setReportSuccess("Báo cáo đã được gửi và đang chờ duyệt.");
      setReportSubmitting(false);

      // Tự động đóng dialog sau 2 giây.
      setTimeout(() => {
        setReportOpen(false);
        setReportPost(null);
        setReportSuccess(null);
      }, 2000);
    } catch (error) {
      setReportSubmitting(false);
      setReportError(
        error.message || "Không thể gửi báo cáo. Vui lòng thử lại.",
      );
    }
  };

  const handleReportClose = () => {
    setReportOpen(false);
    setReportPost(null);
    setReportError(null);
    setReportSuccess(null);
  };

  useEffect(() => {
    if (!targetPostId) {
      return;
    }

    const idStr = String(targetPostId);
    setHighlightedPostId(idStr);

    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      const el = postRefs.current[idStr];
      if (el) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch {
          el.scrollIntoView();
        }
        const headerOffset = 100;
        const rect = el.getBoundingClientRect();
        if (rect.top < headerOffset) {
          window.scrollBy({ top: rect.top - headerOffset, behavior: "smooth" });
        }
        return true;
      }
      return false;
    };

    if (tryScroll()) {
      const t = setTimeout(() => {
        setHighlightedPostId(null);
        if (onClearTargetPost) onClearTargetPost();
      }, 2000);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= maxAttempts) {
        clearInterval(interval);
        const t = setTimeout(() => {
          setHighlightedPostId(null);
          if (onClearTargetPost) onClearTargetPost();
        }, 2000);
      }
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [targetPostId, posts, loading]);

  return (
    <div className="home-page feed-page">

      <CampusHeader
        user={user}
        unreadCount={unreadCount}
        activeNavKey="community"
        navItems={CAMPUS_NAV_ITEMS.map((item) => ({
          ...item,
          onClick: actions[item.onClick],
        }))}
        onGoHome={onGoHome}
        onViewProfile={onViewProfile}
        onLogout={onLogout}
      />


      <main className="feed-main">

        <div className="feed-back">
          <BackButton onClick={onGoHome} />
        </div>

        {/* ================= HEADER FEED ================= */}

        <section className="feed-hero">

          <div className="feed-hero-text">

            <span className="eyebrow">
              CỘNG ĐỒNG SINH VIÊN
            </span>

            <h1 className="feed-title">
              Tất cả bài đăng
            </h1>

            <p className="feed-subtitle">
              Chia sẻ thông tin và kết nối với cộng đồng
              CampusEcom.
            </p>

            <p className="feed-stats">
              <strong>{list.length}</strong> bài đăng từ toàn bộ
              sinh viên trong khuôn viên trường.
            </p>
          </div>

          <div className="feed-hero-actions">

            <button
              className="home-btn home-btn--primary"
              type="button"
              onClick={onCreate}
              disabled={saving}
            >
              <HomeIcon name="pencil" size={16} />

              Đăng bài
            </button>

            <button
              className="home-btn home-btn--outline"
              type="button"
              onClick={onViewMyPosts}
            >
              Bài đăng của tôi
            </button>

          </div>

        </section>


        {/* ================= BỘ LỌC ================= */}

        <PostFilters
          filters={filters}
          onChange={onFilterChange}
        />

        {filterCount > 0 && (
          <p className="feed-filter-note">
            Đang lọc theo {filterCount} tiêu chí — chỉ hiển thị
            bài đăng từ toàn bộ sinh viên.
          </p>
        )}


        {/* ================= THÔNG BÁO ================= */}

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


        {/* ================= FEED ================= */}

        {loading ? (
          <div className="feed-state">
            <span className="feed-spinner" aria-hidden />

            Đang tải bài đăng từ cộng đồng...
          </div>
        ) : list.length === 0 ? (
          <div className="feed-state feed-state--empty">

            <span className="feed-state-icon" aria-hidden>
              <HomeIcon name="posts" size={22} />
            </span>

            <strong>
              {filterCount > 0
                ? "Chưa có bài đăng phù hợp với bộ lọc."
                : "Chưa có bài đăng nào."}
            </strong>

            <p>
              Hãy là người đầu tiên chia sẻ thông tin với cộng đồng
              CampusEcom.
            </p>

            <button
              className="home-btn home-btn--primary"
              type="button"
              onClick={onCreate}
              disabled={saving}
            >
              <HomeIcon name="pencil" size={16} />

              Đăng bài ngay
            </button>

          </div>
        ) : (
          <div className="feed-list">
              {list.map((post) => {
                const ownerId = post?.userId ?? post?.UserId ?? "";

                const isOwner =
                  Boolean(currentUserId) &&
                  String(ownerId).toLowerCase() ===
                    String(currentUserId).toLowerCase();

                const postIdKey = String(post?.id ?? post?.Id ?? "");

                // Library-post (type="library") từ Sàn đổi sách có
                // LibraryPostId trỏ về BookExchangePost.Id. Khi điều
                // hướng từ Library, targetPostId là BookExchangePost.Id,
                // nên cần khớp cả hai khóa.
                const libraryPostIdKey = String(
                  post?.libraryPostId ?? post?.LibraryPostId ?? ""
                );

                const isHighlighted =
                  highlightedPostId === postIdKey ||
                  (libraryPostIdKey &&
                    highlightedPostId === libraryPostIdKey);

                return (
                  <div
                    key={post?.id ?? post?.Id}
                    ref={(el) => {
                      if (el) {
                        postRefs.current[postIdKey] = el;

                        if (libraryPostIdKey) {
                          postRefs.current[libraryPostIdKey] = el;
                        }
                      }
                    }}
                    style={isHighlighted ? { border: "2px solid #2563eb", borderRadius: "12px", boxShadow: "0 0 0 4px rgba(37,99,235,0.08)", transition: "box-shadow 0.3s ease, border 0.3s ease" } : {}}
                  >
                  <FeedPostCard
                    post={post}
                    isOwner={isOwner}
                    likeInfo={postLikes?.[post?.id ?? post?.Id]}
                    liking={likingPostId === (post?.id ?? post?.Id)}
                    onToggleLike={onToggleLike}
                    onOpenDetail={onOpenDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={handleReport}
                    currentUserId={currentUserId}
                    connectionRequests={connectionRequests}
                    connectionSendingId={connectionSendingId}
                    onRequestConnection={onRequestConnection}
                  />
                </div>
              );
            })}
          </div>
        )}

      </main>


      <footer className="home-footer">

        <div className="home-footer-bottom">
          CampusEcomSystemMini · Student &amp; Campus Utility
        </div>

      </footer>


        {detailOpen && (
          <PostDetailModal
            post={detailPost}
            loading={detailLoading}
            error={detailError}
            isOwner={isDetailOwner}
            likeInfo={postLikes?.[detailPost?.id]}
            liking={Boolean(detailPost) && likingPostId === detailPost.id}
            currentUserId={currentUserId}
            connectionRequests={connectionRequests}
            connectionSendingId={connectionSendingId}
            onRequestConnection={onRequestConnection}
            onToggleLike={onToggleLike}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={onCloseDetail}
          />
        )}

        {reportOpen && reportPost && (
          <div
            className="report-dialog-overlay"
            onClick={handleReportClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="report-dialog"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: 24,
                minWidth: 400,
                maxWidth: 500,
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <ReportForm
                postId={reportPost.id}
                postTitle={reportPost.title}
                onSubmit={handleReportSubmit}
                onCancel={handleReportClose}
                loading={reportSubmitting}
                error={reportError}
                success={reportSuccess}
              />
            </div>
          </div>
        )}

        {/* Nút Back to Top lửng bên phải dưới. */}
        {showBackToTop && (
          <button
            className="feed-back-to-top"
            type="button"
            onClick={handleBackToTop}
            aria-label="Về đầu trang"
          >
            <HomeIcon name="arrowUp" size={18} />
            <span>Về đầu</span>
          </button>
        )}

    </div>
  );
}