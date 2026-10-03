// libraryService.js — gọi API Thư viện học thuật (MODULE 4)
// Batch 1: sàn đổi sách.
// Batch 2: tài liệu số.
// Batch 3: tải tài liệu + watermark.
import { request, requestBlob } from "./authService.js";

// Giới hạn file tài liệu theo workflow Upload tài liệu.
// Backend cũng kiểm tra lại, giá trị này chỉ để báo lỗi sớm ở UI.
export const DOCUMENT_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

// Định dạng file được phép đăng tải.
export const DOCUMENT_ACCEPTED_EXTENSIONS = ["pdf", "docx"];

export const DOCUMENT_ACCEPT_ATTRIBUTE =
  DOCUMENT_ACCEPTED_EXTENSIONS.map((item) => `.${item}`).join(",");

// PricingType: Free = miễn phí, Paid = trả phí bằng điểm.
export const DOCUMENT_PRICING_TYPES = [
  { value: "Free", label: "Miễn phí" },
  { value: "Paid", label: "Trả phí" },
];

// Bộ lọc giá của GET /api/library/documents?pricing=...
export const DOCUMENT_PRICING_FILTERS = [
  { value: "", label: "Tất cả tài liệu" },
  { value: "Free", label: "Miễn phí" },
  { value: "Paid", label: "Trả phí" },
];

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


// =====================================================
// TÀI LIỆU SỐ — MODULE 4 / BATCH 2
// =====================================================

// API: GET /api/library/documents
// Danh sách tài liệu, mới nhất trước.
// filters: { search, subject, pricing } — cả ba đều không bắt buộc.
// Danh sách này không trả file gốc.
export async function getDocuments(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.subject) {
    params.append("subject", filters.subject);
  }

  if (filters.pricing) {
    params.append("pricing", filters.pricing);
  }

  const query = params.toString();

  return request(`/api/library/documents${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

// API: GET /api/library/documents/me
// Tài liệu do người dùng đang đăng nhập đăng tải.
// UserId lấy từ JWT, không cần gửi lên.
export async function getMyDocuments() {
  return request("/api/library/documents/me", {
    method: "GET",
  });
}

// API: GET /api/library/documents/{id}
// Chi tiết tài liệu kèm metadata file.
// File gốc được tải qua endpoint download ở batch Download.
export async function getDocumentById(id) {
  return request(`/api/library/documents/${id}`, {
    method: "GET",
  });
}

// API: POST /api/library/documents  (multipart/form-data)
// Đăng tài liệu mới cho người dùng đang đăng nhập.
// File bắt buộc là PDF hoặc DOCX, tối đa 25MB.
// Không gửi userId, không gửi rating / reviewCount.
export async function createDocument({
  title,
  subject,
  description,
  pricing,
  price,
  file,
}) {
  const form = new FormData();

  form.append("Title", title);
  form.append("Subject", subject);
  form.append("Description", description || "");
  form.append("Pricing", pricing);

  // Tài liệu miễn phí không cần giá điểm.
  if (pricing === "Paid") {
    form.append("Price", String(price ?? 0));
  }

  form.append("File", file);

  return request("/api/library/documents", {
    method: "POST",
    body: form,
  });
}

// API: PUT /api/library/documents/{id}
// Chỉ sửa metadata của chính mình.
// Workflow chưa yêu cầu thay file gốc nên không gửi File.
export async function updateDocument(
  id,
  { title, subject, description, price }
) {
  return request(`/api/library/documents/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      subject,
      description: description || null,
      price: price === null || price === undefined ? null : Number(price),
    }),
  });
}

// API: DELETE /api/library/documents/{id}
// Xóa tài liệu của chính mình (kèm file gốc trên storage)
export async function deleteDocument(id) {
  return request(`/api/library/documents/${id}`, {
    method: "DELETE",
  });
}


// =====================================================
// TẢI TÀI LIỆU — MODULE 4 / BATCH 3
// =====================================================

// API: GET /api/library/documents/{id}/download
// Tài liệu miễn phí: trả file đã đóng dấu watermark.
// Tài liệu trả phí: Backend kiểm tra điểm trước khi trả file.
//
// Endpoint này trả file nhị phân nên không dùng request().
// Trả về { blob, fileName } để lớp trên lưu file xuống máy.
export async function downloadDocument(id) {
  return requestBlob(`/api/library/documents/${id}/download`, {
    method: "GET",
  });
}

// Lưu file đã tải xuống máy người dùng.
// Tên file lấy từ Content-Disposition do Backend trả về.
export function saveDownloadedFile({ blob, fileName }, fallbackName) {
  const name = fileName || fallbackName || "document.pdf";

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = name;

  document.body.appendChild(link);

  link.click();

  link.remove();

  // Nhả object URL sau khi trình duyệt bắt đầu tải file.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
