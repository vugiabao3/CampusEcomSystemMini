// notificationService.js — gọi API notification (MODULE_5 / BATCH 4)
import { request } from "./authService.js";

// API: GET /api/notifications
// Danh sách thông báo của người dùng đang đăng nhập.
export async function getNotifications() {
  return request("/api/notifications", {
    method: "GET",
  });
}

// API: GET /api/notifications/unread
// Unread count của người dùng đang đăng nhập.
export async function getUnreadNotifications() {
  return request("/api/notifications/unread", {
    method: "GET",
  });
}

// API: PUT /api/notifications/{id}/read
// Chỉ owner được mark read.
export async function markNotificationAsRead(id) {
  return request(`/api/notifications/${id}/read`, {
    method: "PUT",
  });
}

// API: PUT /api/notifications/read-all
// Đánh dấu tất cả thông báo của người dùng
// đang đăng nhập thành đã đọc.
export async function markAllNotificationsAsRead() {
  return request("/api/notifications/read-all", {
    method: "PUT",
  });
}
