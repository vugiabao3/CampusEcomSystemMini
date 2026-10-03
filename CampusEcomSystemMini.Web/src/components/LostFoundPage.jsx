import {
  getStatusClass,
  getStatusLabel,
} from "./lostFoundStatus.js";
import LostFoundFilter from "./LostFoundFilter.jsx";
import LostFoundList from "./LostFoundList.jsx";
import LostFoundMap from "./LostFoundMap.jsx";
import SecretQuestionForm from "./SecretQuestionForm.jsx";
import SecretQuestionView from "./SecretQuestionView.jsx";
import ClaimForm from "./ClaimForm.jsx";
import ClaimList from "./ClaimList.jsx";

// Trang Campus Lost & Found.
// filter = "" | "Lost" | "Found" | "Returned"
//        ↓
// GET /api/lost-found?type=... hoặc ?status=Returned
//        ↓
// GET /api/lost-found/map
export default function LostFoundPage({
  filter,
  onFilterChange,
  items,
  loading,
  error,
  pins,
  mapLoading,
  mapError,
  user,
  secretItem,
  secretMode,
  secretQuestion,
  secretLoading,
  secretSaving,
  secretError,
  claimItem,
  claimQuestion,
  claimSaving,
  claimError,
  success,
  onOpenSecretQuestion,
  onCloseSecretQuestion,
  onSubmitSecretQuestion,
  onAnswerSecretQuestion,
  onSubmitClaim,
  onCloseClaim,
  claimsItem,
  claims,
  claimsLoading,
  claimsError,
  claimsActionId,
  onOpenClaims,
  onCloseClaims,
  onApproveClaim,
  onRejectClaim,
  onMarkReturned,
  onBack,
}) {
  const currentUserId = user?.id ?? user?.Id ?? "";

  // Chủ bài đăng Found mới được duyệt / từ chối / xác nhận đã trả đồ.
  const isClaimsOwner =
    Boolean(currentUserId) &&
    String(claimsItem?.userId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();

  // Chỉ được xác nhận đã trả đồ khi đã có yêu cầu nhận đồ được duyệt,
  // đúng với quy tắc Backend kiểm tra.
  const hasApprovedClaim =
    (claims ?? []).some((claim) => claim?.status === "Approved");

  const isReturned = claimsItem?.status === "Returned";

  return (
    <section className="pref-card posts-card lost-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">
            CAMPUS LOST & FOUND
          </span>

          <h1 className="pref-title">
            Đồ thất lạc
          </h1>

          <p className="pref-subtitle">
            Theo dõi đồ bị mất, đồ nhặt được và các vị trí
            đồ thất lạc trên campus.
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {items?.length ?? 0} tin
        </span>
      </div>

      <LostFoundFilter
        filter={filter}
        onChange={onFilterChange}
      />

      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      <LostFoundList
        items={items}
        loading={loading}
        error={error}
        currentUserId={currentUserId}
        onOpenSecretQuestion={onOpenSecretQuestion}
        onOpenClaims={onOpenClaims}
      />

      <div className="lost-map-section">
        <span className="posts-filter-label">
          Campus Map
        </span>

        <LostFoundMap
          pins={pins}
          loading={mapLoading}
          error={mapError}
        />
      </div>

      {secretMode === "create" && (
        <SecretQuestionForm
          item={secretItem}
          saving={secretSaving}
          error={secretError}
          onSubmit={onSubmitSecretQuestion}
          onClose={onCloseSecretQuestion}
        />
      )}

      {secretMode === "view" && (
        <SecretQuestionView
          item={secretItem}
          question={secretQuestion}
          loading={secretLoading}
          error={secretError}
          onAnswer={onAnswerSecretQuestion}
          onClose={onCloseSecretQuestion}
        />
      )}

      {claimItem && (
        <ClaimForm
          item={claimItem}
          question={claimQuestion}
          saving={claimSaving}
          error={claimError}
          onSubmit={onSubmitClaim}
          onClose={onCloseClaim}
        />
      )}

      {claimsItem && (
        <div
          className="modal-backdrop"
          onClick={onCloseClaims}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Đóng"
              onClick={onCloseClaims}
            >
              ×
            </button>

            <div className="form-heading">
              <span className="eyebrow">YÊU CẦU NHẬN ĐỒ</span>

              <h2>Danh sách yêu cầu</h2>

              <p>{claimsItem.title}</p>

              {isReturned && (
                <span className={getStatusClass(claimsItem?.status)}>
                  {getStatusLabel(claimsItem?.status)}
                </span>
              )}
            </div>

            <ClaimList
              claims={claims}
              loading={claimsLoading}
              error={claimsError}
              currentUserId={currentUserId}
              actionId={claimsActionId}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
            />

            <div className="posts-actions">
              <button
                className="btn btn--ghost"
                type="button"
                onClick={onCloseClaims}
              >
                Đóng
              </button>

              {isClaimsOwner &&
                hasApprovedClaim &&
                !isReturned && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={claimsActionId === "returned"}
                    onClick={() => onMarkReturned(claimsItem)}
                  >
                    Xác nhận đã trả đồ
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}