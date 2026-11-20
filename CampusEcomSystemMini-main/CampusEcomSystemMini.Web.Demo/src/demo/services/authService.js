// Demo Auth Service - Replaces authService.js for demo mode
import { userRepository } from "../repositories";
import { initializeDemoData, DEMO_CREDENTIALS } from "../data/mockData";

const DEMO_TOKEN_KEY = "campusecom_demo_v1_demo_session";

// Initialize demo data on first load
initializeDemoData();

export function isDemoMode() {
  return true; // Always demo mode for the demo website
}

export { DEMO_CREDENTIALS };

export function getToken() {
  return localStorage.getItem(DEMO_TOKEN_KEY) ? "demo-token" : null;
}

function saveDemoSession(user) {
  localStorage.setItem(DEMO_TOKEN_KEY, JSON.stringify(user));
}

function clearDemoSession() {
  localStorage.removeItem(DEMO_TOKEN_KEY);
}

// Simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function login({ email, password }) {
  await delay(300); // Simulate network delay
  
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    const user = await userRepository.authenticate(email, password);
    if (user) {
      await userRepository.updateLastLogin(user.id);
      saveDemoSession(user);
      return { token: "demo-token", user };
    }
  }
  throw new Error("Email hoặc mật khẩu không đúng.");
}

export async function register({ fullName, email, password }) {
  await delay(300);
  
  // Check if email exists
  const existing = await userRepository.getByEmail(email);
  if (existing) {
    throw new Error("Email đã được sử dụng.");
  }
  
  // Create new user (in demo, we just simulate success)
  const newUser = {
    id: `demo-user-${Date.now()}`,
    fullName,
    email,
    password, // In real app, this would be hashed
    role: "User",
    avatarUrl: null,
    phone: "",
    studentId: `SV${String(Date.now()).slice(-3)}`,
    university: "Đại học Demo",
    faculty: "Demo",
    year: 1,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  
  await userRepository.create(newUser);
  return { success: true };
}

export async function getMe() {
  await delay(100);
  
  const raw = localStorage.getItem(DEMO_TOKEN_KEY);
  if (!raw) throw new Error("Chưa đăng nhập.");
  
  try {
    const user = JSON.parse(raw);
    // Get fresh user data from repository
    const freshUser = await userRepository.getById(user.id);
    if (freshUser) {
      const { password: _, ...userWithoutPassword } = freshUser;
      return userWithoutPassword;
    }
    return user;
  } catch {
    const { password: _, ...userWithoutPassword } = DEMO_CREDENTIALS_EXPORT;
    return { id: "demo-user-1", fullName: "Nguyễn Văn An", email: "111@gmail.com", role: "User" };
  }
}

export async function logout() {
  await delay(100);
  clearDemoSession();
}

export async function request(path, options = {}) {
  // This is kept for compatibility but shouldn't be called in demo mode
  console.warn("[Demo] request() called - should use repositories instead");
  throw new Error("Demo mode: use repositories directly");
}

export async function requestBlob(path, options = {}) {
  console.warn("[Demo] requestBlob() called - should use repositories directly");
  throw new Error("Demo mode: use repositories directly");
}