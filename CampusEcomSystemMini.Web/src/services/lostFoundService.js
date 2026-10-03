// lostFoundService.js — gọi API Campus Lost & Found (MODULE 3)
import { request } from "./authService.js";

// Nhóm bài đăng và trạng thái Lost & Found.
// Giá trị Type/Status do Backend quyết định.
export const LOST_FOUND_FILTERS = [
  { value: "", label: "Tất cả đồ thất lạc" },
  { value: "Lost", label: "Cần Tìm (Báo Mất)" },
  { value: "Found", label: "Nhặt Được (Chờ Chủ)" },
  { value: "Returned", label: "Đã Trao Trả" },
];

// Chuyển giá trị filter thành tham số API:
// Cần Tìm / Nhặt Được dùng type,
// Đã Trao Trả dùng status.
export function buildLostFoundParams(filter) {
  if (!filter) {
    return "";
  }

  if (filter === "Returned") {
    return "?status=Returned";
  }

  if (filter === "Lost" || filter === "Found") {
    return `?type=${filter}`;
  }

  return "";
}

// API: GET /api/lost-found?type=Lost | Found | status=Returned
// filter = "" | "Lost" | "Found" | "Returned"
export async function getLostFoundPosts(filter = "") {
  return request(`/api/lost-found${buildLostFoundParams(filter)}`, {
    method: "GET",
  });
}

// API: GET /api/lost-found/map
// Toạ độ do Backend cung cấp, Frontend chỉ hiển thị pin.
export async function getLostFoundMap() {
  return request("/api/lost-found/map", {
    method: "GET",
  });
}

// API: POST /api/lost-found/{postId}/secret-question
// Người nhặt đồ (chủ bài đăng Found) tạo câu hỏi + câu trả lời.
// Câu trả lời được hash ở Backend và không được trả về.
export async function createSecretQuestion(postId, { question, answer }) {
  return request(`/api/lost-found/${postId}/secret-question`, {
    method: "POST",
    body: JSON.stringify({
      question,
      answer,
    }),
  });
}

// API: GET /api/lost-found/{postId}/secret-question
// Chỉ trả về câu hỏi, không có câu trả lời.
export async function getSecretQuestion(postId) {
  return request(`/api/lost-found/${postId}/secret-question`, {
    method: "GET",
  });
}