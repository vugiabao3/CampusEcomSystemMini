import RatingStars from "./RatingStars.jsx";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewList.jsx";

import {
  formatBookDate,
  formatFileSize,
  formatPrice,
  getDownloadHint,
  getDownloadLabel,
  getFileTypeClass,
  getFileTypeLabel,
  getPricingClass,
  getPricingLabel,
  getRatingLabel,
} from "./documentStatus.js";

// Chi tiết một tài liệu số,
// dữ liệu lấy từ GET /api/library/documents/{id}.
//
// Nút tải gọi GET /api/library/documents/{id}/download.
// File tải về đã được Backend đóng dấu watermark,
// nên frontend không xử lý watermark.
//
// Khu vực đánh giá dùng:
//   GET    /api/library/documents/{id}/reviews
//   POST   /api/library/documents/{id}/reviews
//   PUT    /api/library/reviews/{reviewId}
//   DELETE /api/library/reviews/{reviewId}
export default function DocumentDetail({
  document,
  loading,
  error,
  isOwner,
  downloading,
  downloadError,
  downloadSuccess,
  reviews,
  reviewsLoading,
  reviewsError,
  reviewsSaving,
  reviewsSuccess,
  reviewFormError,
  currentUserId,
  editingReviewId,
  deletingReviewId,
  onEditReview,
  onCancelEditReview,
  onDeleteReview,
  onSubmitReview,
  onSubmitEditReview,
  onEdit,
  onDelete,
  onDownload,
  onClose,
}) {
  // Mỗi người chỉ đánh giá một tài liệu đúng một lần,
  // nên đã có review của mình thì chỉ sửa chứ không tạo mới.
  const myReview = (reviews ?? []).find(
    (review) =>
      Boolean(currentUserId) &&
      String(review?.userId ?? "").toLowerCase() ===
        String(currentUserId).toLowerCase()
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card--detail"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
        >
          ×
        </button>

        {loading && (
          <div className="posts-state">
            Đang tải chi tiết tài liệu...
          </div>
        )}

        {!loading && error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && document && (
          <>
            <div className="post-detail-head">
              <span className="post-type">Tài liệu số</span>

              {isOwner && (
                <span className="post-owner-badge">Của bạn</span>
              )}

              <span className={getPricingClass(document.pricingType)}>
                {getPricingLabel(document.pricingType)}
              </span>

              <span
                className={getFileTypeClass(document.fileType)}
              >
                {getFileTypeLabel(document.fileType)}
              </span>
            </div>

            <h2 className="post-detail-title">
              {document.title}
            </h2>

            <div className="doc-detail-meta">
              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">
                  Môn học / khoa
                </span>

                <span className="doc-detail-meta-value">
                  {document.subject}
                </span>
              </span>

              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">Giá</span>

                <span className="doc-detail-meta-value">
                  {formatPrice(document.price)}
                </span>
              </span>

              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">
                  Người đăng
                </span>

                <span className="doc-detail-meta-value">
                  {document.fullName || "Sinh viên"}
                </span>
              </span>

              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">
                  Tên file
                </span>

                <span
                  className="doc-detail-meta-value doc-detail-meta-value--file"
                  title={document.fileName}
                >
                  {document.fileName}
                </span>
              </span>

              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">
                  Dung lượng
                </span>

                <span className="doc-detail-meta-value">
                  {formatFileSize(document.fileSize)}
                </span>
              </span>

              <span className="doc-detail-meta-item">
                <span className="doc-card-meta-label">
                  Đánh giá
                </span>

                <span className="doc-detail-meta-value doc-detail-rating">
                  <RatingStars
                    rating={document.rating}
                    size="small"
                  />

                  <span>
                    {getRatingLabel(
                      document.rating,
                      document.reviewCount
                    )}
                  </span>
                </span>
              </span>
            </div>

            {document.description && (
              <p className="post-detail-content">
                {document.description}
              </p>
            )}

            <p className="post-detail-updated">
              Đăng lúc {formatBookDate(document.createdAt) || "—"}
            </p>

            {document.updatedAt &&
              document.updatedAt !== document.createdAt && (
                <p className="post-detail-updated">
                  Cập nhật lần cuối:{" "}
                  {formatBookDate(document.updatedAt)}
                </p>
              )}

            <div className="doc-reviews">
              <div className="doc-reviews-head">
                <span className="doc-reviews-title">
                  Đánh giá tài liệu
                </span>

                <span className="doc-reviews-count">
                  {reviews?.length ?? 0} đánh giá
                </span>
              </div>

              {reviewsSuccess && (
                <div className="message message-success" role="status">
                  {reviewsSuccess}
                </div>
              )}

              <ReviewList
                reviews={reviews}
                loading={reviewsLoading}
                error={reviewsError}
                currentUserId={currentUserId}
                editingReviewId={editingReviewId}
                saving={reviewsSaving}
                deletingReviewId={deletingReviewId}
                formError={reviewFormError}
                onEdit={onEditReview}
                onCancelEdit={onCancelEditReview}
                onDelete={onDeleteReview}
                onSubmitEdit={onSubmitEditReview}
              />

              {!editingReviewId &&
                (myReview ? (
                  <p className="doc-reviews-note">
                    Bạn đã đánh giá tài liệu này. Dùng nút “Sửa”
                    trong danh sách để thay đổi.
                  </p>
                ) : (
                  <ReviewForm
                    review={null}
                    saving={reviewsSaving}
                    error={reviewFormError}
                    onSubmit={onSubmitReview}
                  />
                ))}
            </div>

            <div className="doc-download">
              <div className="doc-download-main">
                <span className="doc-card-meta-label">
                  {isOwner ? "Giá (tài liệu của bạn)" : "Giá tải về"}
                </span>

                <span className="doc-download-price">
                  {formatPrice(document.price)}
                </span>
              </div>

              <p className="doc-download-hint">
                {getDownloadHint(document, isOwner)}
              </p>

              <button
                className="btn btn-primary doc-download-btn"
                type="button"
                disabled={downloading}
                onClick={() => onDownload(document)}
              >
                {downloading
                  ? "Đang tải..."
                  : getDownloadLabel(document)}
              </button>

              {downloadError && (
                <div className="message message-error" role="alert">
                  {downloadError}
                </div>
              )}

              {downloadSuccess && (
                <div className="message message-success" role="status">
                  {downloadSuccess}
                </div>
              )}
            </div>

            <div className="posts-actions">
              {isOwner && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onEdit(document)}
                  >
                    Sửa tài liệu
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => onDelete(document)}
                  >
                    Xóa tài liệu
                  </button>
                </>
              )}

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}