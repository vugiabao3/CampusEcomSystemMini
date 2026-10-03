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

// Một tài liệu trong danh sách.
// Toàn bộ dữ liệu do Backend trả về, frontend chỉ hiển thị.
// Download tài liệu thuộc batch Download nên batch này chưa có nút tải.
export default function DocumentCard({
  document,
  isOwner,
  onOpenDetail,
  onEdit,
  onDelete,
}) {
  const title = document?.title ?? "";

  const description = document?.description ?? "";

  return (
    <article className="doc-card">
      <div className="doc-card-head">
        <div className="doc-card-head-main">
          <h3 className="doc-card-title">{title}</h3>

          <span className="doc-card-author">
            {document?.fullName ?? "Sinh viên"}
          </span>
        </div>

        <div className="doc-card-badges">
          <span className={getPricingClass(document?.pricingType)}>
            {getPricingLabel(document?.pricingType)}
          </span>

          <span
            className={getFileTypeClass(document?.fileType)}
            title={document?.fileName}
          >
            {getFileTypeLabel(document?.fileType)}
          </span>
        </div>
      </div>

      <p className="doc-card-subject">{document?.subject ?? ""}</p>

      {description && (
        <p className="doc-card-description">{description}</p>
      )}

      <div className="doc-card-meta">
        <span className="doc-card-meta-item">
          <span className="doc-card-meta-label">Giá</span>

          <span className="doc-card-meta-value">
            {formatPrice(document?.price)}
          </span>
        </span>

        <span className="doc-card-meta-item">
          <span className="doc-card-meta-label">Dung lượng</span>

          <span className="doc-card-meta-value">
            {formatFileSize(document?.fileSize)}
          </span>
        </span>

        <span className="doc-card-meta-item">
          <span className="doc-card-meta-label">Đánh giá</span>

          <span className="doc-card-meta-value">
            {getRatingLabel(
              document?.rating,
              document?.reviewCount
            )}
          </span>
        </span>

        <span className="doc-card-meta-item">
          <span className="doc-card-meta-label">Thời gian</span>

          <span className="doc-card-meta-value">
            {formatBookDate(document?.createdAt) || "—"}
          </span>
        </span>
      </div>

      <div className="doc-card-actions">
        <button
          className="book-action book-action--view"
          type="button"
          onClick={() => onOpenDetail(document)}
        >
          Xem chi tiết
        </button>

        {isOwner && (
          <>
            <button
              className="book-action"
              type="button"
              onClick={() => onEdit(document)}
            >
              Sửa
            </button>

            <button
              className="book-action book-action--delete"
              type="button"
              onClick={() => onDelete(document)}
            >
              Xóa
            </button>
          </>
        )}
      </div>
    </article>
  );
}