import HomeIcon from "./home/HomeIcon.jsx";

// Nút "Yêu cầu kết nối" dùng chung cho thẻ bài đăng và modal chi tiết.
//
// Trạng thái nút được suy ra từ danh sách yêu cầu kết nối đã có
// (GET /api/connections/requests) nên không cần API mới:
//   - Đã kết nối (Accepted)      -> "Đã kết nối" + nút "Mở Chat"
//   - Đang chờ (Pending)         -> "Đã gửi yêu cầu", không bấm lại
//   - Chưa có yêu cầu             -> "Yêu cầu kết nối"
//
// Bài đăng của chính mình không hiển thị nút này.
export default function ConnectionRequestButton({
  post,
  currentUserId,
  requests = [],
  sendingId,
  onRequest,
  onOpenChat,
  size = "sm",
}) {
  const postId = post?.id ?? post?.Id ?? "";

  const ownerId = String(
    post?.userId ?? post?.UserId ?? ""
  ).toLowerCase();

  const me = String(currentUserId ?? "").toLowerCase();

  // Bài của chính mình, hoặc thiếu dữ liệu chủ bài đăng -> không hiện.
  if (!ownerId || !me || ownerId === me) {
    return null;
  }

  const between = (requests ?? []).find((item) => {
    const sender = String(item?.senderId ?? "").toLowerCase();
    const receiver = String(
      item?.receiverId ?? ""
    ).toLowerCase();

    return (
      (sender === me && receiver === ownerId) ||
      (sender === ownerId && receiver === me)
    );
  });

  const status = String(between?.status ?? "").toLowerCase();

  const accepted = status === "accepted";

  const pending = status === "pending";

  const busy = sendingId === postId;

  const classes =
    size === "lg"
      ? "connect-request connect-request--lg"
      : "connect-request";

  if (accepted) {
    return (
      <div className="connect-request-group">

        <button
          className={`${classes} connect-request--connected`}
          type="button"
          disabled
          title="Hai người đã kết nối"
        >
          <HomeIcon name="shield" size={17} />

          <span>Đã kết nối</span>
        </button>

        {onOpenChat && (
          <button
            className={`${classes} connect-request--chat`}
            type="button"
            onClick={() => onOpenChat(ownerId)}
          >
            <HomeIcon name="chat" size={17} />

            <span>Mở Chat</span>
          </button>
        )}
      </div>
    );
  }

  if (pending) {
    return (
      <button
        className={`${classes} connect-request--pending`}
        type="button"
        disabled
        title="Yêu cầu kết nối đang chờ phản hồi"
      >
        <HomeIcon name="bell" size={17} />

        <span>Đã gửi yêu cầu</span>
      </button>
    );
  }

  return (
    <button
      className={`${classes} connect-request--action`}
      type="button"
      disabled={busy}
      onClick={() => onRequest(ownerId, postId)}
      title="Gửi yêu cầu kết nối tới chủ bài đăng"
    >
      <HomeIcon name="user" size={17} />

      <span>{busy ? "Đang gửi..." : "Yêu cầu kết nối"}</span>
    </button>
  );
}