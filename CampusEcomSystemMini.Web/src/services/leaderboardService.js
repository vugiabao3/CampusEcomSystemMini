// leaderboardService.js — gọi API bảng xếp hạng điểm uy tín (MODULE 6 / BATCH 2)
import { request } from "./authService.js";

// Kỳ xếp hạng mà Backend hỗ trợ.
export const LEADERBOARD_PERIODS = [
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

// period = "month" | "year", mặc định month.
export function buildPeriodQuery(period) {
  return period === "year" ? "?period=year" : "?period=month";
}

// API: GET /api/leaderboard?period=month | year
// Xếp hạng do Backend sắp xếp theo ReputationPoints giảm dần.
export async function getLeaderboard(period = "month") {
  return request(`/api/leaderboard${buildPeriodQuery(period)}`, {
    method: "GET",
  });
}

// API: GET /api/leaderboard/me?period=month | year
// Thứ hạng của chính người dùng đang đăng nhập.
export async function getMyRank(period = "month") {
  return request(`/api/leaderboard/me${buildPeriodQuery(period)}`, {
    method: "GET",
  });
}
