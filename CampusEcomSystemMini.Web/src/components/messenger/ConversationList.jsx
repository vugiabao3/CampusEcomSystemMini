// MESSENGER — MODULE_5 / BATCH 2
// Danh sách cuộc trò chuyện của người dùng đang đăng nhập.
// API: conversationService.js
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

function getAvatarInitials(fullName) {
  return (fullName || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

// Danh sách cuộc trò chuyện 1-1.
// Mỗi mục hiển thị người kia, tin nhắn cuối,
// thời gian và số tin nhắn chưa đọc.
export default function ConversationList({
  conversations,
  loading,
  error,
  selectedConversationId,
  onSelect,
}) {
  if (loading) {
    return (
      <div className="messenger-state">
        Đang tải cuộc trò chuyện...
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

  if (!conversations || conversations.length === 0) {
    return (
      <div className="messenger-state messenger-state--empty">
        <span className="messenger-state-icon">
          💬
        </span>

        <h3 className="messenger-state-title">
          Chưa có cuộc trò chuyện
        </h3>

        <p className="messenger-state-text">
          Cuộc trò chuyện 1-1 được tạo khi bạn đồng ý
          kết nối với sinh viên khác.
        </p>
      </div>
    );
  }

  return (
    <ul className="conversation-list">
      {conversations.map((conversation) => {
        const isSelected =
          selectedConversationId === conversation?.conversationId;

        const unreadCount = Number(conversation?.unreadCount) || 0;

        return (
          <li key={conversation?.conversationId}>
            <button
              className={`conversation-item ${isSelected ? "conversation-item--active" : ""}`}
              type="button"
              onClick={() => onSelect(conversation)}
            >
              <div className="conversation-avatar">
                {conversation?.otherUserAvatarUrl ? (
                  <img
                    src={conversation.otherUserAvatarUrl}
                    alt={conversation.otherUserName}
                  />
                ) : (
                  <span>
                    {getAvatarInitials(conversation?.otherUserName) || "?"}
                  </span>
                )}
              </div>

              <div className="conversation-body">
                <div className="conversation-top">
                  <h3 className="conversation-name">
                    {conversation?.otherUserName || "Sinh viên"}
                  </h3>

                  <span className="conversation-time">
                    {formatTime(conversation?.lastMessageAt) ||
                      formatDate(conversation?.lastMessageAt) ||
                      "—"}
                  </span>
                </div>

                <div className="conversation-bottom">
                  <span className="conversation-preview">
                    {conversation?.lastMessage || "Chưa có tin nhắn"}
                  </span>

                  {unreadCount > 0 && (
                    <span className="conversation-unread">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
