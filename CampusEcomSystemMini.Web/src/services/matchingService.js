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