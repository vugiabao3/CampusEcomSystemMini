import RatingStars from "./RatingStars.jsx";
import ReviewForm from "./ReviewForm.jsx";

import {
  getReviewComment,
  getReviewTimeLabel,
} from "./reviewStatus.js";

// Danh sách đánh giá của một tài liệu,
// dữ liệu lấy từ GET /api/library/documents/{id}/reviews.
//
// Chỉ người viết review mới thấy nút Sửa / Xóa,
// Backend cũng kiểm tra lại quyền này.
export default function ReviewList({
  reviews,
  loading,
  error,
  currentUserId,
  editingReviewId,
  saving,
  deletingReviewId,
  formError,
  onEdit,
  onCancelEdit,
  onDelete,
  onSubmitEdit,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải đánh giá...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message message-error" role="alert">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa có đánh giá nào cho tài liệu này.
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const isMine =
          Boolean(currentUserId) &&
          String(review?.userId ?? "").toLowerCase() ===
            String(currentUserId).toLowerCase();

        const isEditing = editingReviewId === review?.id;

        return (
          <article
            key={review?.id}
            className={
              isMine
                ? "review-item review-item--mine"
                : "review-item"
            }
          >
            <div className="review-item-head">
              <span className="review-item-author">
                {review?.fullName || "Sinh viên"}
              </span>

              <RatingStars rating={review?.rating} />
            </div>

            <p className="review-item-time">
              {getReviewTimeLabel(review)}
            </p>

            {getReviewComment(review?.comment) && (
              <p className="review-item-comment">
                {review.comment}
              </p>
            )}

            {isEditing ? (
              <ReviewForm
                review={review}
                saving={saving}
                error={formError}
                onSubmit={onSubmitEdit}
                onCancel={onCancelEdit}
              />
            ) : (
              isMine && (
                <div className="review-item-actions">
                  <button
                    className="book-action"
                    type="button"
                    disabled={saving}
                    onClick={() => onEdit(review)}
                  >
                    Sửa
                  </button>

                  <button
                    className="book-action book-action--delete"
                    type="button"
                    disabled={Boolean(deletingReviewId)}
                    onClick={() => onDelete(review)}
                  >
                    {deletingReviewId === review?.id
                      ? "Đang xóa..."
                      : "Xóa"}
                  </button>
                </div>
              )
            )}
          </article>
        );
      })}
    </div>
  );
}