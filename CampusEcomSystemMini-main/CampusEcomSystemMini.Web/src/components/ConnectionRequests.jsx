import BackButton from "./BackButton.jsx";

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
    timeZone: "Asia/Ho_Chi_Minh",
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
    <section className="connection-page">
      <div className="connection-header">
        <div className="connection-header-main">
          <span className="connection-eyebrow">MESSENGER</span>

          <h1 className="connection-title">Kết nối</h1>

          <p className="connection-subtitle">
            Gửi yêu cầu kết nối, chấp nhận hoặc từ chối
            yêu cầu kết nối từ những sinh viên khác.
          </p>
        </div>

        <span className={`connection-pill ${pendingCount > 0 ? "connection-pill--pending" : "connection-pill--ready"}`}>
          {pendingCount} yêu cầu chờ
        </span>
      </div>

      <div className="connection-tabs" role="tablist">
        <button
          className={`connection-tab ${!isSentMode ? "connection-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={!isSentMode}
          onClick={() => onChangeMode("received")}
        >
          Nhận được
        </button>

        <button
          className={`connection-tab ${isSentMode ? "connection-tab--active" : ""}`}
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

      <form className="connection-send-form" onSubmit={handleSubmitSend}>
        <div className="connection-send-card">
          <h3 className="connection-send-title">Gửi yêu cầu kết nối</h3>
          <p className="connection-send-desc">
            Nhập mã tài khoản (User ID) của sinh viên bạn muốn kết nối.
            Mã tài khoản hiển thị trong hồ sơ cá nhân.
          </p>

          <div className="connection-send-field">
            <label className="connection-send-label" htmlFor="receiverId">
              Mã tài khoản người nhận
            </label>

            <input
              className="connection-send-input"
              id="receiverId"
              type="text"
              placeholder="Ví dụ: a1b2c3d4"
              value={receiverId ?? ""}
              onChange={(event) =>
                onReceiverIdChange(event.target.value)
              }
              disabled={sending}
            />
          </div>

          {sendError && (
            <div className="message message-error" role="alert">
              {sendError}
            </div>
          )}

          <button
            className="btn btn-primary connection-send-action"
            type="submit"
            disabled={sending || !(receiverId ?? "").trim()}
          >
            {sending ? "Đang gửi..." : "Kết nối"}
          </button>
        </div>
      </form>

      <div className="connection-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onOpenMessenger}
        >
          Mở Messenger
        </button>

        <BackButton onClick={onBack} />
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="connection-state connection-state--loading">
          <span className="connection-state-icon">⏳</span>

          <h3 className="connection-state-title">
            Đang tải yêu cầu kết nối...
          </h3>
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="connection-state connection-state--empty">
          <span className="connection-state-icon">👥</span>

          <h3 className="connection-state-title">
            {isSentMode
              ? "Chưa gửi yêu cầu kết nối nào"
              : "Chưa có yêu cầu kết nối đến"}
          </h3>

          <p className="connection-state-text">
            {isSentMode
              ? "Nhập mã tài khoản ở trên để gửi yêu cầu kết nối đến sinh viên khác."
              : "Khi có sinh viên gửi yêu cầu kết nối đến bạn, yêu cầu sẽ hiển thị tại đây."}
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
                    <span className="connection-avatar-initials">
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
