// Nhãn hiển thị cho tài liệu số.
// Dùng chung cho Card, Detail và Filter,
// tách khỏi component để giữ quy ước
// file component chỉ export component.
import { formatBookDate } from "./bookExchangeStatus.js";

export function isPaidDocument(pricingType) {
  return pricingType === "Paid";
}

export function getPricingLabel(pricingType) {
  return isPaidDocument(pricingType) ? "Trả phí" : "Miễn phí";
}

export function getPricingClass(pricingType) {
  if (isPaidDocument(pricingType)) {
    return "doc-pricing doc-pricing--paid";
  }

  return "doc-pricing doc-pricing--free";
}

export function getFileTypeLabel(fileType) {
  return String(fileType ?? "").toUpperCase() || "—";
}

export function getFileTypeClass(fileType) {
  if (fileType === "docx") {
    return "doc-filetype doc-filetype--docx";
  }

  return "doc-filetype doc-filetype--pdf";
}

// Rating được cập nhật ở batch Reviews,
// hiện tại mới tài liệu đều có rating = 0.
export function getRatingLabel(rating, reviewCount) {
  const count = Number(reviewCount ?? 0);

  if (!count) {
    return "Chưa có đánh giá";
  }

  const value = Number(rating ?? 0).toFixed(1);

  return `${value}/5 · ${count} đánh giá`;
}

export function formatFileSize(fileSize) {
  const bytes = Number(fileSize ?? 0);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatPrice(price) {
  const value = Number(price ?? 0);

  if (!Number.isFinite(value) || value <= 0) {
    return "Miễn phí";
  }

  return `${value.toLocaleString("vi-VN")} điểm`;
}

export { formatBookDate };