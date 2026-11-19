// Nhãn hiển thị cho bài đăng đổi sách.
// Dùng chung cho Card, Detail và Exchange Match,
// tách khỏi component để giữ quy ước
// file component chỉ export component.
export function getStatusLabel(status) {
  if (status === "Open") {
    return "Đang tìm đổi";
  }

  return "Đã đóng";
}

export function getStatusClass(status) {
  if (status === "Open") {
    return "book-status book-status--open";
  }

  return "book-status book-status--closed";
}

// MatchType do Backend quyết định:
// Direct = A cần X và B có X,
// Cycle = chuỗi đổi sách A -> B -> C -> A.
export function getMatchTypeLabel(matchType) {
  if (matchType === "Cycle") {
    return "Chuỗi đổi sách";
  }

  return "Đổi trực tiếp";
}

export function getMatchTypeClass(matchType) {
  if (matchType === "Cycle") {
    return "book-match-type book-match-type--cycle";
  }

  return "book-match-type book-match-type--direct";
}

export function formatBookDate(value) {
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
