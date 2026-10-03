// gọi API  backend 


const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5067"
).replace(/\/+$/, "");

const TOKEN_KEY = "campus_access_token";

// Đọc token đã lưu trong trình duyệt
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Lưu token sau khi đăng nhập
function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Xóa token khi đăng xuất hoặc token không còn hợp lệ
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Hàm dùng chung để gọi Backend
export async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Đọc nội dung phản hồi; một số API có thể trả về body rỗng
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
  const message =
    typeof data === "string"
      ? data
      : data?.message ||
        data?.title ||
        data?.detail ||
        `Yêu cầu thất bại (${response.status})`;

  const error = new Error(message);

  // Quan trọng: preferenceService cần status để bắt 404
  error.status = response.status;
  error.data = data;

  throw error;
}

    // Giữ lại HTTP status để service khác xử lý riêng (ví dụ 404)
    error.status = response.status;

    throw error;
  }

  return data;
}

// API 1: POST /api/auth/register
export async function register({ fullName, email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName,
      email,
      password,
    }),
  });
}

// API 2: POST /api/auth/login
export async function login({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  // LoginResponse của Backend có thuộc tính Token
  const token = data?.token ?? data?.Token;

  if (!token) {
    throw new Error(
      "Đăng nhập thành công nhưng phản hồi không có JWT token."
    );
  }

  saveToken(token);

  return data;
}

// API 3: GET /api/auth/me
export async function getMe() {
  try {
    return await request("/api/auth/me", {
      method: "GET",
    });
  } catch (error) {
    // Nếu JWT hết hạn hoặc không còn được chấp nhận,
    // xóa token để người dùng đăng nhập lại.
    clearToken();
    throw error;
  }
}

// API 4: POST /api/auth/logout
export async function logout() {
  try {
    return await request("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    // Xóa token ở trình duyệt kể cả khi API logout lỗi
    clearToken();
  }
}
