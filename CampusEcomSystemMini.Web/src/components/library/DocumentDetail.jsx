import {
  formatBookDate,
  formatFileSize,
  formatPrice,
  getFileTypeClass,
  getFileTypeLabel,
  getPricingClass,
  getPricingLabel,
  getRatingLabel,
} from "./documentStatus.js";

// Chi tiết một tài liệu số,
// dữ liệu lấy từ GET /api/library/documents/{id}.
//
// File gốc không được trả trực tiếp ở batch này:
// tải tài liệu đi qua endpoint download của batch Download,
// nên phần tải file chưa có trong UI.
export default function DocumentDetail({
  document,
  loading,
  error,
  isOwner,
  onEdit,
  onDelete,
  onClose,
}) {
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

                <span className="doc-detail-meta-value">
                  {getRatingLabel(
                    document.rating,
                    document.reviewCount
                  )}
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