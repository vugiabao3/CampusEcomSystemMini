// Nhãn hiển thị cho tin Lost & Found.
// Dùng chung cho Card và Map, tách khỏi component để giữ
// quy ước file component chỉ export component.
export function getTypeLabel(type) {
  if (type === "Lost") {
    return "Cần Tìm";
  }

  if (type === "Found") {
    return "Nhặt Được";
  }

  return "Lost & Found";
}

export function getStatusLabel(status) {
  if (status === "Returned") {
    return "Đã Trao Trả";
  }

  if (status === "Found") {
    return "Chờ Chủ";
  }

  if (status === "Lost") {
    return "Đang Tìm";
  }

  return "Lost & Found";
}

export function getStatusClass(status) {
  if (status === "Returned") {
    return "lost-status lost-status--returned";
  }

  if (status === "Found") {
    return "lost-status lost-status--found";
  }

  return "lost-status lost-status--lost";
}