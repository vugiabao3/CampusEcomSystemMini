// Nhãn hiển thị cho đánh giá tài liệu.
// Dùng chung cho ReviewList, ReviewForm và chi tiết tài liệu,
// tách khỏi component để giữ quy ước
// file component chỉ export component.
import { formatBookDate } from "./bookExchangeStatus.js";

// Rating do Backend quy định nằm trong khoảng 1–5.
export const REVIEW_MIN_RATING = 1;

export const REVIEW_MAX_RATING = 5;

// Nhãn mô tả từng mức điểm trong form chọn rating.
export const REVIEW_RATING_LABELS = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Rất tốt",
};

// Chuẩn hóa rating từ API hoặc từ form.
export function normalizeRating(rating) {
  const value = Number(rating);

  if (
    !Number.isInteger(value) ||
    value < REVIEW_MIN_RATING ||
    value > REVIEW_MAX_RATING
  ) {
    return 0;
  }

  return value;
}

// Mảng 1–5 để dựng sao đánh giá.
export function getRatingSteps(rating) {
  const value = normalizeRating(rating);

  return Array.from(
    { length: REVIEW_MAX_RATING },
    (_, index) => index + 1 <= value
  );
}

export function getRatingLabel(rating) {
  return REVIEW_RATING_LABELS[normalizeRating(rating)] ?? "";
}

// Nội dung review rỗng thì không hiển thị.
export function getReviewComment(comment) {
  const value = String(comment ?? "").trim();

  return value || null;
}

// Thời gian: có hiển thị "đã sửa" khi review được cập nhật.
export function getReviewTimeLabel(review) {
  const created = formatBookDate(review?.createdAt);

  if (!created) {
    return "—";
  }

  if (review?.updatedAt && review.updatedAt !== review.createdAt) {
    return `${created} · đã sửa ${formatBookDate(review.updatedAt)}`;
  }

  return created;
}

export { formatBookDate };