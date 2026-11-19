// preferenceService.js — gọi API vector nhu cầu (Preferences) của người dùng
import { request } from "./authService.js";

// API: GET /api/users/me/preferences
// Lấy vector nhu cầu của người dùng đang đăng nhập.
// Backend trả 404 nếu người dùng chưa tạo vector nhu cầu.
export async function getPreferences() {
  try {
    return await request("/api/users/me/preferences", {
      method: "GET",
    });
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}

// API: POST /api/users/me/preferences
// Tạo vector nhu cầu cho người dùng đang đăng nhập.
// Gửi đầy đủ 16 tiêu chí: 8 nhóm học + 8 tìm trọ / ở ghép.
export async function createPreferences(preferences) {
  return request("/api/users/me/preferences", {
    method: "POST",
    body: JSON.stringify({
      studySubjects: preferences.studySubjects,
      studyLanguages: preferences.studyLanguages,
      studyGoal: preferences.studyGoal,
      studyProficiency: preferences.studyProficiency,
      studyTime: preferences.studyTime,
      studyFormat: preferences.studyFormat,
      studyMethod: preferences.studyMethod,
      studyFrequency: preferences.studyFrequency,
      roomArea: preferences.roomArea,
      roomBudgetRaw: preferences.roomBudgetRaw,
      roomType: preferences.roomType,
      roomSleepSchedule: preferences.roomSleepSchedule,
      roomCleanliness: preferences.roomCleanliness,
      roomNoisePreference: preferences.roomNoisePreference,
      roomCookingHabits: preferences.roomCookingHabits,
      roomAmenities: preferences.roomAmenities,
    }),
  });
}

// API: PUT /api/users/me/preferences
// Cập nhật vector nhu cầu đã tồn tại
export async function updatePreferences(preferences) {
  return request("/api/users/me/preferences", {
    method: "PUT",
    body: JSON.stringify({
      studySubjects: preferences.studySubjects,
      studyLanguages: preferences.studyLanguages,
      studyGoal: preferences.studyGoal,
      studyProficiency: preferences.studyProficiency,
      studyTime: preferences.studyTime,
      studyFormat: preferences.studyFormat,
      studyMethod: preferences.studyMethod,
      studyFrequency: preferences.studyFrequency,
      roomArea: preferences.roomArea,
      roomBudgetRaw: preferences.roomBudgetRaw,
      roomType: preferences.roomType,
      roomSleepSchedule: preferences.roomSleepSchedule,
      roomCleanliness: preferences.roomCleanliness,
      roomNoisePreference: preferences.roomNoisePreference,
      roomCookingHabits: preferences.roomCookingHabits,
      roomAmenities: preferences.roomAmenities,
    }),
  });
}

// API: DELETE /api/users/me/preferences
// Xóa vector nhu cầu của người dùng đang đăng nhập
export async function deletePreferences() {
  return request("/api/users/me/preferences", {
    method: "DELETE",
  });
}