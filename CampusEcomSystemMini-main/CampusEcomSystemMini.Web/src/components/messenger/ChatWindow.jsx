// MESSENGER â€” MODULE_5 / BATCH 2 + 3
// Cá»­a sá»• trÃ² chuyá»‡n: tiÃªu Ä‘á» ngÆ°á»i kia,
// lá»‹ch sá»­ tin nháº¯n vÃ  Ã´ gá»­i tin nháº¯n
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
  // ChÆ°a chá»n cuá»™c trÃ² chuyá»‡n nÃ o.
  if (!conversation) {
    return (
      <div className="chat-window chat-window--placeholder">
        <span className="chat-window-icon">
          ðŸ’¬
        </span>

        <h3 className="chat-window-title">
          Chá»n má»™t cuá»™c trÃ² chuyá»‡n
        </h3>

        <p className="chat-window-text">
          Chá»n cuá»™c trÃ² chuyá»‡n bÃªn trÃ¡i Ä‘á»ƒ xem
          lá»‹ch sá»­ tin nháº¯n.
        </p>
      </div>
    );
  }

  // NgÆ°á»i kia trong cuá»™c trÃ² chuyá»‡n 1-1
  // lÃ  participant khÃ´ng pháº£i ngÆ°á»i dÃ¹ng Ä‘ang Ä‘Äƒng nháº­p.
  const participants = detail?.participants ?? [];

  const other = participants.find(
    (participant) =>
      String(participant?.userId ?? "").toLowerCase() !==
      String(currentUserId ?? "").toLowerCase()
  );

  const otherName =
    other?.fullName ||
    conversation?.otherUserName ||
    "Sinh viÃªn";

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
              ? "Cuá»™c trÃ² chuyá»‡n 1-1 Â· Äang káº¿t ná»‘i"
              : "Cuá»™c trÃ² chuyá»‡n 1-1"}
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
            <div className='chat-connecting'>Kết nối chat realtime đang được thiết lập...</div>
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
