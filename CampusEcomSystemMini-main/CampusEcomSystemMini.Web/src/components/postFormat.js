// Định dạng ngày giờ dùng chung cho các thẻ bài đăng.

// Hiển thị thời gian theo kiểu mạng xã hội:
// dưới 1 phút -> "Vừa xong", dưới 1 giờ -> "x phút trước",
// dưới 1 ngày -> "x giờ trước", dưới 7 ngày -> "x ngày trước",
// ngoài ra thì trả về ngày giờ đầy đủ.
export function formatPostDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return formatFullDate(date);
  }

  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return "Vừa xong";
  }

  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ngày trước`;
  }

  return formatFullDate(date);
}

function formatFullDate(date) {
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}