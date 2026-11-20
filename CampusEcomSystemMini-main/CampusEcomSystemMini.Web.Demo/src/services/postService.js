// postService.js — gọi API bài đăng (Posts)
import { request } from "./authService.js";

// API: GET /api/posts
// Danh sách bài đăng, mới nhất trước.
// filters: { type, time } — cả hai đều không bắt buộc.
export async function getPosts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.type) {
    params.append("type", filters.type);
  }

  if (filters.time) {
    params.append("time", filters.time);
  }

  const query = params.toString();

  return request(`/api/posts${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

// API: GET /api/posts/me
// Danh sách bài đăng của người dùng đang đăng nhập
export async function getMyPosts() {
  return request("/api/posts/me", {
    method: "GET",
  });
}

// API: GET /api/posts/me/liked
// Danh sách bài đăng mà người dùng đã thích
export async function getLikedPosts() {
  return request("/api/posts/me/liked", {
    method: "GET",
  });
}

// API: GET /api/posts/{id}
// Chi tiết một bài đăng
export async function getPostById(id) {
  return request(`/api/posts/${id}`, {
    method: "GET",
  });
}

// API: POST /api/posts
// Tạo bài đăng mới cho người dùng đang đăng nhập
export async function createPost({ title, content, type, location, lat, lng, secretQuestion, secretAnswer }) {
  return request("/api/posts", {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      type: type || null,
      location: location || null,
      lat: lat ?? null,
      lng: lng ?? null,
      secretQuestion: secretQuestion || null,
      secretAnswer: secretAnswer || null,
    }),
  });
}

// API: PUT /api/posts/{id}
// Cập nhật bài đăng của chính mình
export async function updatePost(id, { title, content, type, location, lat, lng }) {
  return request(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      content,
      type: type || null,
      location: location || null,
      lat: lat ?? null,
      lng: lng ?? null,
    }),
  });
}

// API: DELETE /api/posts/{id}
// Xóa bài đăng của chính mình
export async function deletePost(id) {
  return request(`/api/posts/${id}`, {
    method: "DELETE",
  });
}

// API: POST /api/posts/{id}/like
// Thích bài đăng (mỗi người chỉ thích một lần)
export async function likePost(id) {
  return request(`/api/posts/${id}/like`, {
    method: "POST",
  });
}

// API: DELETE /api/posts/{id}/like
// Bỏ thích bài đăng của chính mình
export async function unlikePost(id) {
  return request(`/api/posts/${id}/like`, {
    method: "DELETE",
  });
}

// API: GET /api/posts/{id}/likes
// Danh sách những người đã thích bài đăng
export async function getPostLikes(id) {
  return request(`/api/posts/${id}/likes`, {
    method: "GET",
  });
}