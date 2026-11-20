// reportService.js — gọi API báo cáo (MODULE_6 / BATCH 3)
import { request } from "./authService.js";

// API: POST /api/reports
// Báo cáo bài đăng. Reporter lấy từ JWT.
export async function createReport(postId, reason, description) {
  return request("/api/reports", {
    method: "POST",
    body: JSON.stringify({
      postId,
      reason: reason.trim(),
      description: description?.trim() ?? null,
    }),
  });
}

// API: GET /api/reports/me
// Danh sách báo cáo của người dùng đang đăng nhập.
export async function getMyReports() {
  return request("/api/reports/me", {
    method: "GET",
  });
}