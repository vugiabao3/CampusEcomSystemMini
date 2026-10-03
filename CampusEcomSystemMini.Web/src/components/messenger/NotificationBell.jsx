// NOTIFICATION BELL — MODULE_5 / BATCH 4
// Chuông thông báo: 🔔 Unread Count → Notification List.
// API: notificationService.js
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

function getNotificationTypeLabel(type) {
  if (type === "ConnectionRequest") {
    return "Kết nối";
  }

  if (type === "ConnectionAccepted") {
    return "Đã đồng ý kết nối";
  }

  if (type === "ConnectionRejected") {
    return "Đã từ chối kết nối";
  }

  if (type === "StudyMatch") {
    return "Tìm nhóm học";
  }

  if (type === "RoomMatch") {
    return "Tìm trọ / Ở ghép";
  }

  if (type === "LostFoundMatch") {
    return "Đồ thất lạc";
  }

  return "Thông báo";
}

export default function NotificationBell({
  unreadCount,
  notifications,
  loading,
  error,
  open,
  actionId,
  onToggle,
  onOpenNotification,
  onMarkAllAsRead,
}) {
  const count = Number(unreadCount) || 0;

  return (
    <div className="notification-bell">
      <button
        className={`notification-bell-button ${open ? "notification-bell-button--active" : ""}`}
        type="button"
        aria-label="Thông báo"
        onClick={onToggle}
      >
        <span className="notification-bell-icon">
          🔔
        </span>

        {count > 0 && (
          <span className="notification-bell-badge">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <header className="notification-panel-header">
            <h3 className="notification-panel-title">
              Thông báo
            </h3>

            <button
              className="text-button"
              type="button"
              disabled={actionId !== null}
              onClick={onMarkAllAsRead}
            >
              Đánh dấu đã đọc hết
            </button>
          </header>

          {loading ? (
            <div className="notification-state">
              Đang tải thông báo...
            </div>
          ) : error ? (
            <div className="message message-error" role="alert">
              {error}
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="notification-state notification-state--empty">
              <span className="notification-state-icon">
                🔕
              </span>

              <h4 className="notification-state-title">
                Chưa có thông báo
              </h4>

              <p className="notification-state-text">
                Thông báo kết nối, matching sẽ
                hiển thị tại đây.
              </p>
            </div>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li key={notification?.notificationId}>
                  <button
                    className={`notification-item ${notification?.isRead ? "" : "notification-item--unread"}`}
                    type="button"
                    disabled={
                      actionId === notification?.notificationId
                    }
                    onClick={() => onOpenNotification(notification)}
                  >
                    <div className="notification-item-top">
                      <span className="notification-item-type">
                        {getNotificationTypeLabel(
                          notification?.type
                        )}
                      </span>

                      <span className="notification-item-time">
                        {formatTime(notification?.createdAt) ||
                          "—"}
                      </span>
                    </div>

                    <h4 className="notification-item-title">
                      {notification?.title}
                    </h4>

                    <p className="notification-item-message">
                      {notification?.message}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
