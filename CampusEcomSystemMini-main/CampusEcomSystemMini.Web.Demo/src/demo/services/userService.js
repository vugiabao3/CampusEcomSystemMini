// Demo User Service
import { userRepository } from "../repositories";
import { delay } from "./authService";

export async function getUserProfile() {
  await delay(100);
  const user = await userRepository.getById("demo-user-1");
  if (!user) throw new Error("Không tìm thấy hồ sơ.");
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Alias for compatibility with App.jsx imports
export const getMe = getUserProfile;

export async function updateProfile({ fullName, email, phone }) {
  await delay(200);
  const user = await userRepository.getById("demo-user-1");
  if (!user) throw new Error("Không tìm thấy người dùng.");
  
  // Check email uniqueness
  if (email !== user.email) {
    const existing = await userRepository.getByEmail(email);
    if (existing) throw new Error("Email đã được sử dụng.");
  }
  
  return userRepository.update("demo-user-1", { fullName, email, phone });
}

export async function updateAvatar({ avatarUrl }) {
  await delay(200);
  return userRepository.update("demo-user-1", { avatarUrl });
}

export async function changePassword({ currentPassword, newPassword }) {
  await delay(200);
  const user = await userRepository.getById("demo-user-1");
  if (!user) throw new Error("Không tìm thấy người dùng.");
  
  if (user.password !== currentPassword) {
    throw new Error("Mật khẩu hiện tại không đúng.");
  }
  
  return userRepository.update("demo-user-1", { password: newPassword });
}