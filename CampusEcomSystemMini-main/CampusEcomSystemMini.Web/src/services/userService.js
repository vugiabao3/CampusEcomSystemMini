// userService.js — gọi API profile người dùng
import { request } from "./authService.js";

// API: GET /api/users/me
// Lấy thông tin profile của người dùng đang đăng nhập
export async function getMe() {
  return request("/api/users/me", {
    method: "GET",
  });
}

// API: PUT /api/users/me
// Cập nhật thông tin cá nhân (FullName, Email, Phone)
export async function updateProfile({ fullName, email, phone }) {
  return request("/api/users/me", {
    method: "PUT",
    body: JSON.stringify({
      fullName,
      email,
      phone,
    }),
  });
}

// API: PUT /api/users/me/avatar
// Cập nhật avatar
export async function updateAvatar({ avatarUrl }) {
  return request("/api/users/me/avatar", {
    method: "PUT",
    body: JSON.stringify({
      avatarUrl,
    }),
  });
}

// API: PUT /api/users/me/password
// Đổi mật khẩu
export async function changePassword({ currentPassword, newPassword }) {
  return request("/api/users/me/password", {
    method: "PUT",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}
