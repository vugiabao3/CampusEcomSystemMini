// MESSENGER — MODULE_5 / BATCH 2
// Danh sách tin nhắn trong cuộc trò chuyện.
// Tin nhắn của mình nằm bên phải, tin nhắn của
// người kia nằm bên trái kèm tên người gửi.
function formatTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function MessageList({
  messages,
  loading,
  error,
  currentUserId,
}) {
  if (loading) {
    return (
      <div className="messenger-state">
        Đang tải tin nhắn...
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

  if (!messages || messages.length === 0) {
    return (
      <div className="messenger-state messenger-state--empty">
        <span className="messenger-state-icon">
          ✉️
        </span>

        <h3 className="messenger-state-title">
          Chưa có tin nhắn
        </h3>

        <p className="messenger-state-text">
          Lịch sử tin nhắn của cuộc trò chuyện này
          sẽ hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <ul className="message-list">
      {messages.map((message) => {
        const isMine =
          String(message?.senderId ?? "").toLowerCase() ===
          String(currentUserId ?? "").toLowerCase();

        return (
          <li
            key={message?.messageId}
            className={`message-row ${isMine ? "message-row--mine" : ""}`}
          >
            <div className="message-bubble">
              {!isMine && (
                <span className="message-sender">
                  {message?.senderName || "Sinh viên"}
                </span>
              )}

              <p className="message-text">{message?.content}</p>

              <span className="message-time">
                {formatTime(message?.sentAt)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
