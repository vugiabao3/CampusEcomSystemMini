import { getRatingSteps } from "./reviewStatus.js";

// Dải sao hiển thị điểm đánh giá 1–5.
// Chỉ hiển thị, không nhận input:
// chọn điểm nằm ở ReviewForm.
export default function RatingStars({ rating, size }) {
  const steps = getRatingSteps(rating);

  return (
    <span
      className={
        size === "small"
          ? "review-stars review-stars--small"
          : "review-stars"
      }
      aria-label={`${steps.filter(Boolean).length}/5 điểm`}
    >
      {steps.map((isActive, index) => (
        <span
          key={index}
          className={
            isActive
              ? "review-star review-star--active"
              : "review-star"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}