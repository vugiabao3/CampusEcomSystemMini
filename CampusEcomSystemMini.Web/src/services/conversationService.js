// conversationService.js — gọi API cuộc trò chuyện (MODULE_5 / BATCH 2)
import { request } from "./authService.js";

// API: GET /api/conversations
// Danh sách cuộc trò chuyện của người dùng đang đăng nhập,
// kèm người kia (OtherUser), tin nhắn cuối, thời gian
// và số tin nhắn chưa đọc.
export async function getConversations() {
  return request("/api/conversations", {
    method: "GET",
  });
}

// API: GET /api/conversations/{id}
// Chi tiết cuộc trò chuyện (danh sách participant).
// Chỉ participant được xem, nếu không: 403 Forbidden.
export async function getConversation(id) {
  return request(`/api/conversations/${id}`, {
    method: "GET",
  });
}

// API: GET /api/conversations/{conversationId}/messages
// Lịch sử tin nhắn theo thứ tự thời gian.
// page / pageSize không bắt buộc (mặc định 1 / 30).
// Chỉ participant được xem, nếu không: 403 Forbidden.
export async function getConversationMessages(
  conversationId,
  page = 1,
  pageSize = 30
) {
  return request(
    `/api/conversations/${conversationId}/messages?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
    }
  );
}
