// gamificationService.js — gọi API điểm uy tín và lịch sử điểm (MODULE 6 / BATCH 1)
import { request } from "./authService.js";

// API: GET /api/gamification/me
// Điểm hiện tại của người dùng đang đăng nhập.
// Backend lấy userId từ JWT, frontend không gửi userId.
export async function getMyPoints() {
  return request("/api/gamification/me", {
    method: "GET",
  });
}

// API: GET /api/gamification/history
// Lịch sử cộng / trừ điểm của người dùng đang đăng nhập,
// giao dịch mới nhất lên đầu do Backend sắp xếp.
export async function getPointHistory() {
  return request("/api/gamification/history", {
    method: "GET",
  });
}
