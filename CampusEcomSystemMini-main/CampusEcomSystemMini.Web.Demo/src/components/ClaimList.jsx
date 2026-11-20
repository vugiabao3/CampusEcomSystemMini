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

function getClaimStatusLabel(status) {
  if (status === "Pending") {
    return "Đang chờ duyệt";
  }

  if (status === "Approved") {
    return "Đã duyệt";
  }

  if (status === "Rejected") {
    return "Đã từ chối";
  }

  return "Đang chờ duyệt";
}

function getClaimStatusClass(status) {
  if (status === "Approved") {
    return "claim-status claim-status--approved";
  }

  if (status === "Rejected") {
    return "claim-status claim-status--rejected";
  }

  return "claim-status claim-status--pending";
}

// Danh sách yêu cầu nhận đồ của chủ bài đăng Found.
// Yêu cầu đang chờ có nút Duyệt / Từ chối,
// trạng thái sau khi xử lý do Backend trả về.
export default function ClaimList({
  claims,
  loading,
  error,
  currentUserId,
  actionId,
  onApprove,
  onReject,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải yêu cầu nhận đồ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message message-error" role="alert">
        {error}
      </div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa có yêu cầu nhận đồ.
      </div>
    );
  }

  return (
    <ul className="claim-list">
      {claims.map((claim) => {
        const claimantName = claim?.fullName ?? "";
        const isCurrentUser =
          Boolean(currentUserId) &&
          String(claim?.claimantUserId ?? "").toLowerCase() ===
            String(currentUserId).toLowerCase();

        // Chỉ yêu cầu đang chờ mới được duyệt hoặc từ chối.
        const isPending = claim?.status === "Pending";

        const isBusy = actionId === claim?.claimId;

        return (
          <li className="claim-item" key={claim?.claimId}>
            <div className="claim-item-main">
              <span className="claim-item-name">
                {claimantName}
                {isCurrentUser && (
                  <span className="claim-item-you"> (bạn)</span>
                )}
              </span>

              <span className="claim-item-time">
                {formatDate(claim?.createdAt) || "—"}
              </span>
            </div>

            <div className="claim-item-side">
              <span className={getClaimStatusClass(claim?.status)}>
                {getClaimStatusLabel(claim?.status)}
              </span>

              {isPending && (
                <div className="claim-item-actions">
                  <button
                    className="claim-action claim-action--approve"
                    type="button"
                    disabled={isBusy}
                    onClick={() => onApprove(claim)}
                  >
                    Duyệt
                  </button>

                  <button
                    className="claim-action claim-action--reject"
                    type="button"
                    disabled={isBusy}
                    onClick={() => onReject(claim)}
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}