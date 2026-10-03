import {
  getStatusLabel,
  getStatusClass,
  getTypeLabel,
} from "./lostFoundStatus.js";

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

function formatCoordinate(value) {
  const coordinate = Number(value);

  if (!Number.isFinite(coordinate)) {
    return null;
  }

  return coordinate.toFixed(5);
}

// Một tin Lost & Found trong danh sách.
// Toàn bộ dữ liệu do Backend trả về, frontend chỉ hiển thị.
export default function LostFoundCard({
  item,
  currentUserId,
  onOpenSecretQuestion,
}) {
  const title = item?.title ?? "";
  const description = item?.description ?? "";
  const fullName = item?.fullName ?? "";
  const location = item?.location ?? null;

  const lat = formatCoordinate(item?.lat);

  const lng = formatCoordinate(item?.lng);

  // Câu hỏi bí mật chỉ dành cho bài đăng Found.
  const isFound = item?.type === "Found";

  const isOwner =
    Boolean(currentUserId) &&
    String(item?.userId ?? "").toLowerCase() ===
      String(currentUserId).toLowerCase();

  return (
    <article className="lost-card">
      <div className="lost-card-head">
        <div>
          <h3 className="lost-card-title">{title}</h3>

          <span className="lost-card-author">{fullName}</span>
        </div>

        <span className={getStatusClass(item?.status)}>
          {getStatusLabel(item?.status)}
        </span>
      </div>

      {description && (
        <p className="lost-card-description">{description}</p>
      )}

      <div className="lost-card-meta">
        <span className="lost-card-meta-item">
          <span className="lost-card-meta-label">Loại</span>
          <span className="lost-card-meta-value">
            {getTypeLabel(item?.type)}
          </span>
        </span>

        <span className="lost-card-meta-item">
          <span className="lost-card-meta-label">Vị trí</span>
          <span className="lost-card-meta-value">
            {location ?? "Chưa cập nhật"}
          </span>
        </span>

        <span className="lost-card-meta-item">
          <span className="lost-card-meta-label">Toạ độ</span>
          <span className="lost-card-meta-value">
            {lat && lng ? `${lat}, ${lng}` : "Chưa cập nhật"}
          </span>
        </span>

        <span className="lost-card-meta-item">
          <span className="lost-card-meta-label">Thời gian</span>
          <span className="lost-card-meta-value">
            {formatDate(item?.createdAt) || "—"}
          </span>
        </span>
      </div>

      {isFound && (
        <button
          className="match-card-action"
          type="button"
          onClick={() => onOpenSecretQuestion(item)}
        >
          {isOwner
            ? "Tạo câu hỏi bí mật"
            : "Xem câu hỏi bí mật"}
        </button>
      )}
    </article>
  );
}