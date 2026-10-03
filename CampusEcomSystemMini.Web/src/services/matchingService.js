// matchingService.js — gọi API Smart Matching của Module 2
import { request } from "./authService.js";

// API: GET /api/matching/students
// Danh sách sinh viên phù hợp, backend đã tính MatchScore
// và loại bỏ ứng viên dưới 40%.
export async function getStudentMatches() {
  return request("/api/matching/students", {
    method: "GET",
  });
}

// API: GET /api/matching/students/{userId}
// Mức độ tương thích với một sinh viên cụ thể.
export async function getStudentMatch(userId) {
  return request(`/api/matching/students/${userId}`, {
    method: "GET",
  });
}

// API: GET /api/matching/rooms
// Danh sách ứng viên tìm trọ / ở ghép, backend đã tính MatchScore
// và loại bỏ ứng viên dưới 40%.
export async function getRoomMatches() {
  return request("/api/matching/rooms", {
    method: "GET",
  });
}

// API: GET /api/matching/rooms/{userId}
// Mức độ phù hợp về chỗ ở với một ứng viên cụ thể.
export async function getRoomMatch(userId) {
  return request(`/api/matching/rooms/${userId}`, {
    method: "GET",
  });
}