import StudentMatchList from "./StudentMatchList.jsx";
import MatchDetailModal from "./MatchDetailModal.jsx";
import RoomMatchList from "./RoomMatchList.jsx";
import RoomMatchDetailModal from "./RoomMatchDetailModal.jsx";

// SMART MATCHING — Tìm nhóm học / Tìm trọ & ở ghép.
// Toàn bộ MatchScore do Backend tính, frontend chỉ hiển thị.
export default function SmartMatching({
  mode,
  onChangeMode,
  matches,
  loading,
  error,
  detailOpen,
  detail,
  detailLoading,
  detailError,
  onOpenDetail,
  onCloseDetail,
  roomMatches,
  roomLoading,
  roomError,
  roomDetailOpen,
  roomDetail,
  roomDetailLoading,
  roomDetailError,
  onOpenRoomDetail,
  onCloseRoomDetail,
  onEditPreferences,
  onBack,
}) {
  const isRoomMode = mode === "rooms";

  const currentMatches = isRoomMode ? roomMatches : matches;

  return (
    <section className="pref-card match-card-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">SMART MATCHING</span>

          <h1 className="pref-title">
            {isRoomMode ? "Tìm trọ / Ở ghép" : "Tìm nhóm học"}
          </h1>

          <p className="pref-subtitle">
            {isRoomMode
              ? "Gợi ý người tìm trọ / ở ghép phù hợp dựa trên " +
                "khu vực, ngân sách và lối sống của bạn."
              : "Gợi ý sinh viên phù hợp dựa trên vector nhu cầu " +
                "(thói quen, mục tiêu, khu vực, ngân sách) của bạn."}
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {currentMatches?.length ?? 0} gợi ý
        </span>
      </div>

      <div className="match-tabs" role="tablist">
        <button
          className={`match-tab ${isRoomMode ? "" : "match-tab--active"}`}
          type="button"
          role="tab"
          aria-selected={!isRoomMode}
          onClick={() => onChangeMode("students")}
        >
          Tìm nhóm học
        </button>

        <button
          className={`match-tab ${isRoomMode ? "match-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={isRoomMode}
          onClick={() => onChangeMode("rooms")}
        >
          Tìm trọ / Ở ghép
        </button>
      </div>

      {!isRoomMode && error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {isRoomMode && roomError && (
        <div className="message message-error" role="alert">
          {roomError}
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

      {!isRoomMode && loading && (
        <div className="match-state">
          Đang tìm người phù hợp...
        </div>
      )}

      {!isRoomMode && !loading && (
        <StudentMatchList
          matches={matches}
          onOpenDetail={onOpenDetail}
        />
      )}

      {isRoomMode && roomLoading && (
        <div className="match-state">
          Đang tìm người ở ghép phù hợp...
        </div>
      )}

      {isRoomMode && !roomLoading && (
        <RoomMatchList
          matches={roomMatches}
          onOpenDetail={onOpenRoomDetail}
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

      {roomDetailOpen && (
        <RoomMatchDetailModal
          detail={roomDetail}
          loading={roomDetailLoading}
          error={roomDetailError}
          onClose={onCloseRoomDetail}
        />
      )}
    </section>
  );
}