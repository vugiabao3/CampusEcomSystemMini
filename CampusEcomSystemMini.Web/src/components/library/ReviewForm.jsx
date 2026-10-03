import { useState } from "react";

import RatingStars from "./RatingStars.jsx";

import {
  REVIEW_MAX_RATING,
  REVIEW_MIN_RATING,
  getRatingLabel,
} from "./reviewStatus.js";

// Form viết / sửa đánh giá tài liệu.
//
// review = null  => tạo đánh giá mới
// review = đối tượng => sửa đánh giá của chính mình
//
// Không có ô nhập UserId: người viết review lấy từ JWT ở Backend.
export default function ReviewForm({
  review,
  saving,
  error,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(review);

  const [rating, setRating] = useState(
    Number(review?.rating) || REVIEW_MAX_RATING
  );

  const [comment, setComment] = useState(review?.comment ?? "");

  const [validationError, setValidationError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");

    if (rating < REVIEW_MIN_RATING || rating > REVIEW_MAX_RATING) {
      setValidationError("Vui lòng chọn điểm đánh giá từ 1 đến 5.");
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
    });
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-head">
        <span className="review-form-title">
          {isEdit ? "Sửa đánh giá của bạn" : "Viết đánh giá của bạn"}
        </span>

        {isEdit && (
          <button
            className="text-button"
            type="button"
            disabled={saving}
            onClick={onCancel}
          >
            Hủy sửa
          </button>
        )}
      </div>

      {validationError && (
        <div className="message message-error" role="alert">
          {validationError}
        </div>
      )}

      {error && (
        <div className="message message-error" role="alert">
          {error}
        </div>
      )}

      <div className="review-form-rating">
        <span className="review-form-label">Điểm đánh giá</span>

        <div
          className="review-rating-input"
          role="radiogroup"
          aria-label="Chọn điểm đánh giá từ 1 đến 5"
        >
          {Array.from(
            { length: REVIEW_MAX_RATING - REVIEW_MIN_RATING + 1 },
            (_, index) => REVIEW_MIN_RATING + index
          ).map((value) => (
            <button
              key={value}
              type="button"
              className={
                value === rating
                  ? "review-rating-option review-rating-option--active"
                  : "review-rating-option"
              }
              role="radio"
              aria-checked={value === rating}
              disabled={saving}
              onClick={() => setRating(value)}
            >
              <RatingStars rating={value} size="small" />

              <span className="review-rating-option-label">
                {value}/5
              </span>
            </button>
          ))}
        </div>

        <span className="review-rating-current">
          <RatingStars rating={rating} />

          {getRatingLabel(rating)}
        </span>
      </div>

      <div className="review-form-comment">
        <label
          className="review-form-label"
          htmlFor={`review-comment-${review?.id ?? "new"}`}
        >
          Nhận xét
        </label>

        <textarea
          id={`review-comment-${review?.id ?? "new"}`}
          className="review-comment-input"
          rows={3}
          maxLength={1000}
          placeholder="Tài liệu này có gì đáng giá?"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <div className="review-form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Đang lưu..."
            : isEdit
              ? "Lưu đánh giá"
              : "Gửi đánh giá"}
        </button>
      </div>
    </form>
  );
}