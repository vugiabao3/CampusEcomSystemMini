// libraryService.js — gọi API Thư viện học thuật (MODULE 4 / BATCH 1)
// Chỉ phần đổi sách. Tài liệu số thuộc batch sau.
import { request } from "./authService.js";

// Tình trạng sách do sinh viên tự chọn khi đăng bài đổi sách.
// Backend vẫn nhận giá trị tự do, danh sách này chỉ phục vụ UI.
export const BOOK_CONDITIONS = [
  { value: "New", label: "Mới" },
  { value: "Like New", label: "Như mới" },
  { value: "Good", label: "Tốt" },
  { value: "Fair", label: "Khá" },
  { value: "Old", label: "Cũ" },
];

// Trạng thái bài đăng do Backend quyết định (Open khi tạo mới).
export const BOOK_STATUS_FILTERS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Open", label: "Đang tìm đổi" },
];

// API: GET /api/library/books
// Danh sách bài đăng đổi sách, mới nhất trước.
// filters: { search, status } — cả hai đều không bắt buộc.
// search khớp vào tên sách đang có hoặc tên sách đang tìm.
export async function getBooks(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.status) {
    params.append("status", filters.status);
  }

  const query = params.toString();

  return request(`/api/library/books${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

// API: GET /api/library/books/me
// Danh sách bài đăng đổi sách của người dùng đang đăng nhập.
// UserId lấy từ JWT, không cần gửi lên.
export async function getMyBooks() {
  return request("/api/library/books/me", {
    method: "GET",
  });
}

// API: GET /api/library/books/exchange-matches
// Các bài đăng khớp đổi sách với bài đăng của người đang đăng nhập:
// direct match và chuỗi đổi sách A -> B -> C -> A.
export async function getExchangeMatches() {
  return request("/api/library/books/exchange-matches", {
    method: "GET",
  });
}

// API: GET /api/library/books/{id}
// Chi tiết một bài đăng đổi sách
export async function getBookById(id) {
  return request(`/api/library/books/${id}`, {
    method: "GET",
  });
}

// API: POST /api/library/books
// Tạo bài đăng đổi sách mới cho người dùng đang đăng nhập.
// Không gửi userId, không gửi status.
export async function createBook({
  bookName,
  wantedBookName,
  condition,
  description,
}) {
  return request("/api/library/books", {
    method: "POST",
    body: JSON.stringify({
      bookName,
      wantedBookName,
      condition,
      description: description || null,
    }),
  });
}

// API: PUT /api/library/books/{id}
// Cập nhật bài đăng đổi sách của chính mình
export async function updateBook(
  id,
  { bookName, wantedBookName, condition, description }
) {
  return request(`/api/library/books/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      bookName,
      wantedBookName,
      condition,
      description: description || null,
    }),
  });
}

// API: DELETE /api/library/books/{id}
// Xóa bài đăng đổi sách của chính mình
export async function deleteBook(id) {
  return request(`/api/library/books/${id}`, {
    method: "DELETE",
  });
}
