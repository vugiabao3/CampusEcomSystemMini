// CONNECTION REQUESTS — MODULE_5 / BATCH 1
// Trang yêu cầu kết nối: gửi / xem / chấp nhận / từ chối.
// API: connectionService.js
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

function getConnectionStatusLabel(status) {
  if (status === "Accepted") {
    return "Đã đồng ý";
  }

  if (status === "Rejected") {
    return "Đã từ chối";
  }

  return "Đang chờ";
}

function getConnectionStatusClass(status) {
  if (status === "Accepted") {
    return "connection-status connection-status--accepted";
  }

  if (status === "Rejected") {
    return "connection-status connection-status--rejected";
  }

  return "connection-status connection-status--pending";
}

function getAvatarInitials(fullName) {
  return (fullName || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

// Lọc yêu cầu theo tab: nhận được hoặc đã gửi.
function filterRequests(requests, mode, currentUserId) {
  const list = requests ?? [];

  const id = String(currentUserId ?? "").toLowerCase();

  if (!id) {
    return [];
  }

  return list.filter((request) => {
    const isSentByMe =
      String(request?.senderId ?? "").toLowerCase() === id;

    return mode === "sent" ? isSentByMe : !isSentByMe;
  });
}

export default function ConnectionRequests({
  mode,
  onChangeMode,
  requests,
  loading,
  error,
  success,
  currentUserId,
  actionId,
  receiverId,
  sending,
  sendError,
  onReceiverIdChange,
  onSend,
  onAccept,
  onReject,
  onOpenMessenger,
  onBack,
}) {
  const isSentMode = mode === "sent";

  const visibleRequests = filterRequests(
    requests,
    mode,
    currentUserId
  );

  const pendingCount = (requests ?? []).filter(
    (request) =>
      request?.status === "Pending" &&
      String(request?.receiverId ?? "").toLowerCase() ===
        String(currentUserId ?? "").toLowerCase()
  ).length;

  function handleSubmitSend(event) {
    event.preventDefault();

    onSend(receiverId);
  }

  return (
    <section className="pref-card connection-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">
            MESSENGER
          </span>

          <h1 className="pref-title">
            Kết nối
          </h1>

          <p className="pref-subtitle">
            Gửi yêu cầu kết nối, chấp nhận hoặc từ chối
            yêu cầu kết nối từ những sinh viên khác.
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {pendingCount} yêu cầu chờ
        </span>
      </div>

      <div className="match-tabs" role="tablist">
        <button
          className={`match-tab ${!isSentMode ? "match-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={!isSentMode}
          onClick={() => onChangeMode("received")}
        >
          Nhận được
        </button>

        <button
          className={`match-tab ${isSentMode ? "match-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={isSentMode}
          onClick={() => onChangeMode("sent")}
        >
          Đã gửi
        </button>
      </div>

      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      <form className="connection-send" onSubmit={handleSubmitSend}>
        <div className="connection-send-field">
          <label className="connection-send-label" htmlFor="receiverId">
            Gửi yêu cầu kết nối
          </label>

          <input
            className="connection-send-input"
            id="receiverId"
            type="text"
            placeholder="Nhập mã tài khoản người nhận"
            value={receiverId ?? ""}
            onChange={(event) =>
              onReceiverIdChange(event.target.value)
            }
            disabled={sending}
          />

          <span className="form-hint">
            Nhập mã tài khoản (User ID) của sinh viên bạn muốn
            kết nối. Mã tài khoản hiển thị trong hồ sơ cá nhân.
          </span>
        </div>

        <button
          className="btn btn-primary connection-send-action"
          type="submit"
          disabled={sending || !(receiverId ?? "").trim()}
        >
          {sending ? "Đang gửi..." : "Kết nối"}
        </button>
      </form>

      {sendError && (
        <div className="message message-error" role="alert">
          {sendError}
        </div>
      )}

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onOpenMessenger}
        >
          Mở Messenger
        </button>

        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="connection-state">
          Đang tải yêu cầu kết nối...
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="connection-state connection-state--empty">
          <span className="connection-state-icon">
            👥
          </span>

          <h3 className="connection-state-title">
            {isSentMode
              ? "Chưa gửi yêu cầu kết nối"
              : "Chưa có yêu cầu kết nối"}
          </h3>

          <p className="connection-state-text">
            {isSentMode
              ? "Nhập mã tài khoản phía trên để gửi yêu cầu " +
                "kết nối đến sinh viên khác."
              : "Yêu cầu kết nối từ sinh viên khác sẽ hiển thị " +
                "tại đây khi có."}
          </p>
        </div>
      ) : (
        <ul className="connection-list">
          {visibleRequests.map((request) => {
            const isSentByMe =
              String(request?.senderId ?? "").toLowerCase() ===
              String(currentUserId ?? "").toLowerCase();

            const otherName = isSentByMe
              ? request?.receiverName
              : request?.senderName;

            const otherAvatarUrl = isSentByMe
              ? request?.receiverAvatarUrl
              : request?.senderAvatarUrl;

            const isPending = request?.status === "Pending";

            const isBusy = actionId === request?.connectionRequestId;

            return (
              <li className="connection-item" key={request?.connectionRequestId}>
                <div className="connection-avatar">
                  {otherAvatarUrl ? (
                    <img src={otherAvatarUrl} alt={otherName} />
                  ) : (
                    <span>
                      {getAvatarInitials(otherName) || "?"}
                    </span>
                  )}
                </div>

                <div className="connection-body">
                  <h3 className="connection-name">
                    {otherName || "Sinh viên"}
                  </h3>

                  <span className="connection-time">
                    {formatDate(request?.createdAt) || "—"}
                  </span>
                </div>

                <div className="connection-side">
                  <span className={getConnectionStatusClass(request?.status)}>
                    {getConnectionStatusLabel(request?.status)}
                  </span>

                  {isSentByMe && isPending && (
                    <span className="connection-waiting">
                      Đang chờ phản hồi
                    </span>
                  )}

                  {!isSentByMe && isPending && (
                    <div className="connection-actions">
                      <button
                        className="connection-action connection-action--accept"
                        type="button"
                        disabled={isBusy}
                        onClick={() => onAccept(request)}
                      >
                        {isBusy ? "Đang xử lý..." : "Đồng ý"}
                      </button>

                      <button
                        className="connection-action connection-action--reject"
                        type="button"
                        disabled={isBusy}
                        onClick={() => onReject(request)}
                      >
                        {isBusy ? "Đang xử lý..." : "Từ chối"}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
