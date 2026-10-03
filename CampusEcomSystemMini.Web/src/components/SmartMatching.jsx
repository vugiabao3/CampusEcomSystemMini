import StudentMatchList from "./StudentMatchList.jsx";
import MatchDetailModal from "./MatchDetailModal.jsx";

// SMART MATCHING — Tìm nhóm học.
// Toàn bộ MatchScore do Backend tính, frontend chỉ hiển thị.
export default function SmartMatching({
  matches,
  loading,
  error,
  detailOpen,
  detail,
  detailLoading,
  detailError,
  onOpenDetail,
  onCloseDetail,
  onEditPreferences,
  onBack,
}) {
  return (
    <section className="pref-card match-card-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">SMART MATCHING</span>

          <h1 className="pref-title">Tìm nhóm học</h1>

          <p className="pref-subtitle">
            Gợi ý sinh viên phù hợp dựa trên vector nhu cầu
            (thói quen, mục tiêu, khu vực, ngân sách) của bạn.
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {matches?.length ?? 0} gợi ý
        </span>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onEditPreferences}
        >
          Cập nhật vector nhu cầu
        </button>

        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      {loading ? (
        <div className="match-state">
          Đang tìm người phù hợp...
        </div>
      ) : (
        <StudentMatchList
          matches={matches}
          onOpenDetail={onOpenDetail}
        />
      )}

      {detailOpen && (
        <MatchDetailModal
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={onCloseDetail}
        />
      )}
    </section>
  );
}