// connectionService.js — gọi API kết nối (MODULE_5 / BATCH 1)
import { request } from "./authService.js";

// API: POST /api/connections/requests
// Gửi yêu cầu kết nối đến ReceiverId.
// Sender được Backend lấy từ JWT, không gửi từ client.
export async function sendConnectionRequest(receiverId) {
  return request("/api/connections/requests", {
    method: "POST",
    body: JSON.stringify({
      receiverId,
    }),
  });
}

// API: GET /api/connections/requests
// Danh sách yêu cầu kết nối của người dùng đang đăng nhập
// (gồm Received và Sent, frontend tự phân biệt).
export async function getConnectionRequests() {
  return request("/api/connections/requests", {
    method: "GET",
  });
}

// API: PUT /api/connections/requests/{id}/accept
// Người nhận yêu cầu chấp nhận kết nối.
export async function acceptConnectionRequest(id) {
  return request(`/api/connections/requests/${id}/accept`, {
    method: "PUT",
  });
}

// API: PUT /api/connections/requests/{id}/reject
// Người nhận yêu cầu từ chối kết nối.
export async function rejectConnectionRequest(id) {
  return request(`/api/connections/requests/${id}/reject`, {
    method: "PUT",
  });
}
