// MESSENGER — MODULE_5 / BATCH 2 + 4
// Trang Messenger: danh sách cuộc trò chuyện
// bên trái, cửa sổ trò chuyện bên phải,
// chuông thông báo ở góc trên.
// API: conversationService.js, notificationService.js
import ConversationList from "./ConversationList.jsx";
import ChatWindow from "./ChatWindow.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function MessengerPage({
  conversations,
  loading,
  error,
  selectedConversation,
  selectedConversationId,
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
  unreadCount,
  notifications,
  notificationsLoading,
  notificationsError,
  notificationsOpen,
  notificationActionId,
  onToggleNotifications,
  onOpenNotification,
  onMarkAllNotificationsAsRead,
  onSelectConversation,
  onOpenConnections,
  onBack,
}) {
  return (
    <section className="pref-card messenger-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">
            MESSENGER
          </span>

          <h1 className="pref-title">
            Tin nhắn
          </h1>

          <p className="pref-subtitle">
            Trò chuyện 1-1 với những sinh viên
            đã đồng ý kết nối với bạn.
          </p>
        </div>

        <div className="messenger-heading-side">
          <NotificationBell
            unreadCount={unreadCount}
            notifications={notifications}
            loading={notificationsLoading}
            error={notificationsError}
            open={notificationsOpen}
            actionId={notificationActionId}
            onToggle={onToggleNotifications}
            onOpenNotification={onOpenNotification}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
          />

          <span className="pref-status pref-status--ready">
            {conversations?.length ?? 0} cuộc trò chuyện
          </span>
        </div>
      </div>

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onOpenConnections}
        >
          Yêu cầu kết nối
        </button>

        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      <div className="messenger-layout">
        <aside className="messenger-sidebar">
          <h2 className="messenger-sidebar-title">
            Cuộc trò chuyện
          </h2>

          <ConversationList
            conversations={conversations}
            loading={loading}
            error=""
            selectedConversationId={selectedConversationId}
            onSelect={onSelectConversation}
          />
        </aside>

        <div className="messenger-main">
          <ChatWindow
            conversation={selectedConversation}
            detail={detail}
            detailLoading={detailLoading}
            detailError={detailError}
            messages={messages}
            messagesLoading={messagesLoading}
            messagesError={messagesError}
            currentUserId={currentUserId}
            chatConnected={chatConnected}
            sendingMessage={sendingMessage}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </section>
  );
}
