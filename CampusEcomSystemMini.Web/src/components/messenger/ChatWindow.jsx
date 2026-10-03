// MESSENGER — MODULE_5 / BATCH 2 + 3
// Cửa sổ trò chuyện: tiêu đề người kia,
// lịch sử tin nhắn và ô gửi tin nhắn
// realtime qua SignalR /hubs/chat.
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

function getAvatarInitials(fullName) {
  return (fullName || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

export default function ChatWindow({
  conversation,
  detail,
  detailLoading,
  detailError,
  messages,
  messagesLoading,
  messagesError,
  currentUserId,
  chatConnected,
  sendingMessage,
  onSendMessage,
}) {
  // Chưa chọn cuộc trò chuyện nào.
  if (!conversation) {
    return (
      <div className="chat-window chat-window--placeholder">
        <span className="chat-window-icon">
          💬
        </span>

        <h3 className="chat-window-title">
          Chọn một cuộc trò chuyện
        </h3>

        <p className="chat-window-text">
          Chọn cuộc trò chuyện bên trái để xem
          lịch sử tin nhắn.
        </p>
      </div>
    );
  }

  // Người kia trong cuộc trò chuyện 1-1
  // là participant không phải người dùng đang đăng nhập.
  const participants = detail?.participants ?? [];

  const other = participants.find(
    (participant) =>
      String(participant?.userId ?? "").toLowerCase() !==
      String(currentUserId ?? "").toLowerCase()
  );

  const otherName =
    other?.fullName ||
    conversation?.otherUserName ||
    "Sinh viên";

  const otherAvatarUrl =
    other?.avatarUrl ??
    conversation?.otherUserAvatarUrl ??
    null;

  return (
    <div className="chat-window">
      <header className="chat-window-header">
        <div className="chat-window-avatar">
          {otherAvatarUrl ? (
            <img src={otherAvatarUrl} alt={otherName} />
          ) : (
            <span>{getAvatarInitials(otherName) || "?"}</span>
          )}
        </div>

        <div className="chat-window-info">
          <h3 className="chat-window-name">{otherName}</h3>

          <span className="chat-window-status">
            {chatConnected
              ? "Cuộc trò chuyện 1-1 · Đang kết nối"
              : "Cuộc trò chuyện 1-1"}
          </span>
        </div>
      </header>

      <div className="chat-window-body">
        {detailError && (
          <div className="message message-error" role="alert">
            {detailError}
          </div>
        )}

        {!chatConnected && (
          <div className="message message-error" role="alert">
            Kết nối chat realtime chưa sẵn sàng.
            Lịch sử tin nhắn vẫn hiển thị từ Database.
          </div>
        )}

        {messagesError && (
          <div className="message message-error" role="alert">
            {messagesError}
          </div>
        )}

        <MessageList
          messages={messages}
          loading={messagesLoading || detailLoading}
          error=""
          currentUserId={currentUserId}
        />
      </div>

      <MessageInput
        disabled={!chatConnected}
        sending={sendingMessage}
        onSend={onSendMessage}
      />
    </div>
  );
}
