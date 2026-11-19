import {
  getStatusClass,
  getStatusLabel,
  getTypeLabel,
} from "./lostFoundStatus.js";
import { useState } from "react";

import BackButton from "./BackButton.jsx";
import LostFoundFilter from "./LostFoundFilter.jsx";
import LostFoundList from "./LostFoundList.jsx";
import SecretQuestionForm from "./SecretQuestionForm.jsx";
import SecretQuestionView from "./SecretQuestionView.jsx";
import ClaimForm from "./ClaimForm.jsx";
import ClaimList from "./ClaimList.jsx";

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
  connectionRequests = [],
  connectionSendingId,
  onRequestConnection,
  onCreate,
  onViewMatches,
  onViewDetail,
  verifiedPostIds,
}) {
  const currentUserId = user?.id ?? user?.Id ?? "";
  const isClaimsOwner =
    Boolean(currentUserId) &&
    String(claimsItem?.userId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();
  const hasApprovedClaim = (claims ?? []).some((claim) => claim?.status === "Approved");
  const isReturned = claimsItem?.status === "Returned";

  const [matchesItem, setMatchesItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");

  const handleViewMatches = async (item) => {
    if (!onViewMatches) {
      return;
    }

    setMatchesItem(item);
    setMatchesLoading(true);
    setMatchesError("");

    try {
      const data = await onViewMatches(item.postId);
      setMatches(data);
    } catch (error) {
      setMatchesError(error.message || "Không thể tải danh sách đồ khớp.");
    } finally {
      setMatchesLoading(false);
    }
  };

  const closeMatches = () => {
    setMatchesItem(null);
    setMatches([]);
    setMatchesError("");
  };

  const noop = () => {};

  return (
    <section className="pref-card posts-card lost-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">CAMPUS LOST & FOUND</span>
           <h1 className="pref-title">Đồ thất lạc</h1>
          <p className="pref-subtitle">
            Theo dõi đồ bị mất, đồ nhặt được và các vị trí đồ thất lạc trên campus.
          </p>
        </div>
        <span className="pref-status pref-status--ready">
          {items?.length ?? 0} tin
        </span>
      </div>
      <LostFoundFilter filter={filter} onChange={onFilterChange} />
      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}
      <div className="posts-toolbar">
        <button className="btn btn-primary" type="button" onClick={() => onCreate?.("lost")}>
          Đăng Tin Mất (Lost)
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => onCreate?.("found")} style={{ marginLeft: "8px" }}>
          Đăng Tin Nhặt (Found)
        </button>
        <BackButton onClick={onBack} />
      </div>
      <LostFoundList
        items={items}
        loading={loading}
        error={error}
         currentUserId={currentUserId}
        onOpenSecretQuestion={onOpenSecretQuestion}
        onOpenClaims={onOpenClaims}
        connectionRequests={connectionRequests}
        connectionSendingId={connectionSendingId}
        onRequestConnection={onRequestConnection}
        onViewMatches={handleViewMatches}
        onViewDetail={onViewDetail}
        verifiedPostIds={verifiedPostIds}
      />
      {matchesItem && (
        <div className="lost-matches-section">
          <div className="lost-matches-header">
            <h3>Đồ khớp với: {matchesItem.title}</h3>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={closeMatches}
            >
              Đóng
            </button>
          </div>
          {matchesLoading && (
            <div className="posts-state">Đang tải đồ khớp...</div>
          )}
          {matchesError && (
            <div className="message message-error" role="alert">
              {matchesError}
            </div>
          )}
          {!matchesLoading && !matchesError && matches && matches.length === 0 && (
            <div className="posts-state posts-state--empty">
              Không tìm thấy đồ khớp trong bán kính 500m.
            </div>
          )}
          {!matchesLoading && !matchesError && matches && matches.length > 0 && (
              <LostFoundList
                items={matches}
                loading={false}
                error={null}
                currentUserId={currentUserId}
                onOpenSecretQuestion={noop}
                onOpenClaims={noop}
                connectionRequests={[]}
                connectionSendingId={""}
                onRequestConnection={noop}
                onViewMatches={noop}
                verifiedPostIds={verifiedPostIds}
              />
          )}
        </div>
      )}

      {/* CÂU HỎI BÍ MẬT — CREATE (chủ bài đăng Found tạo câu hỏi) */}
      {secretMode === "create" && secretItem && (
        <SecretQuestionForm
          item={secretItem}
          saving={secretSaving}
          error={secretError}
          onSubmit={onSubmitSecretQuestion}
          onClose={onCloseSecretQuestion}
        />
      )}

      {/* CÂU HỎI BÍ MẬT — VIEW (người khác xem câu hỏi) */}
      {secretMode === "view" && secretItem && (
        <SecretQuestionView
          item={secretItem}
          question={secretQuestion}
          loading={secretLoading}
          error={secretError}
          onAnswer={onAnswerSecretQuestion}
          onClose={onCloseSecretQuestion}
        />
      )}

      {/* CLAIM FORM — người mất đồ nhập câu trả lời */}
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

      {/* CLAIM LIST — chủ bài đăng Found xem yêu cầu nhận đồ */}
      {claimsItem && (
        <ClaimList
          claims={claims}
          loading={claimsLoading}
          error={claimsError}
          currentUserId={currentUserId}
          actionId={claimsActionId}
          onApprove={onApproveClaim}
          onReject={onRejectClaim}
        />
      )}
    </section>
  );
}