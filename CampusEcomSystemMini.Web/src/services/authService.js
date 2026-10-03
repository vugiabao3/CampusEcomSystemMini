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
  const response = await send(path, options);

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
    throw buildError(data, response.status);
  }

  return data;
}

// Endpoint tải tài liệu trả về file nhị phân nên không
// dùng request() (hàm này parse JSON).
// Thông tin lỗi của endpoint download vẫn là JSON.
export async function requestBlob(path, options = {}) {
  const response = await send(path, options);

  if (!response.ok) {
    const text = await response.text();

    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    throw buildError(data, response.status);
  }

  const blob = await response.blob();

  const fileName = readFileName(response.headers.get("content-disposition"));

  return { blob, fileName };
}

// Gửi request kèm JWT, dùng chung cho request và requestBlob.
async function send(path, options = {}) {
  const token = getToken();

  const headers = {
    // FormData phải để trình duyệt tự gắn Content-Type
    // kèm boundary, nếu gán application/json sẽ không parse được.
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

function buildError(data, status) {
  const message =
    typeof data === "string"
      ? data
      : data?.message ||
        data?.title ||
        data?.detail ||
        `Yêu cầu thất bại (${status})`;

  const error = new Error(message);

  // Giữ lại HTTP status để service khác xử lý riêng (ví dụ 404)
  error.status = status;

  return error;
}

// Content-Disposition của file tải về có dạng
// attachment; filename="tai-lieu.pdf".
function readFileName(contentDisposition) {
  if (!contentDisposition) {
    return "";
  }

  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].trim();
    }
  }

  const match = contentDisposition.match(/filename="?([^";]+)"?/i);

  return match ? match[1].trim() : "";
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