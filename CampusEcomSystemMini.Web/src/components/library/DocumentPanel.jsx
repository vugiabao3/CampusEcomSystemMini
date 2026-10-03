import DocumentDetail from "./DocumentDetail.jsx";
import DocumentFilter from "./DocumentFilter.jsx";
import DocumentForm from "./DocumentForm.jsx";
import DocumentList from "./DocumentList.jsx";

// Tài liệu số — MODULE 4 / BATCH 2 + BATCH 3 + BATCH 4.
//
// Tài liệu miễn phí / tài liệu trả phí
//   ↓
// GET /api/library/documents          (có filter search / subject / pricing)
// GET /api/library/documents/me       (tài liệu của tôi)
// GET /api/library/documents/{id}     (chi tiết)
// POST /api/library/documents         (multipart/form-data)
// PUT  /api/library/documents/{id}    (chỉ sửa metadata)
// DELETE /api/library/documents/{id}
// GET  /api/library/documents/{id}/download  (file đã có watermark)
// GET  /api/library/documents/{id}/reviews    (đánh giá)
// POST /api/library/documents/{id}/reviews    (tạo đánh giá)
// PUT  /api/library/reviews/{reviewId}         (sửa đánh giá của mình)
// DELETE /api/library/reviews/{reviewId}       (xóa đánh giá của mình)
export default function DocumentPanel({
  mode,
  onChangeMode,
  documents,
  user,
  loading,
  saving,
  error,
  filters,
  onFilterChange,
  onResetFilters,
  onEdit,
  onDelete,
  onSubmitDocument,
  onOpenDetail,
  onCloseForm,
  onCloseDetail,
  onDownload,
  formOpen,
  formDocument,
  detailOpen,
  detail,
  detailLoading,
  detailError,
  downloadingId,
  downloadError,
  downloadSuccess,
  reviews,
  reviewsLoading,
  reviewsError,
  reviewsSaving,
  reviewsSuccess,
  reviewFormError,
  editingReviewId,
  deletingReviewId,
  onEditReview,
  onCancelEditReview,
  onDeleteReview,
  onSubmitReview,
  onSubmitEditReview,
}) {
  const currentUserId = user?.id ?? user?.Id ?? "";

  const isMine = mode === "mine";

  const detailOwnerId = detail?.userId ?? detail?.UserId ?? "";

  const isDetailOwner =
    Boolean(currentUserId) &&
    String(detailOwnerId).toLowerCase() ===
      String(currentUserId).toLowerCase();

  return (
    <>
      {/* Khi tải tài liệu, thông báo kết quả / lỗi trả về từ
          GET /api/library/documents/{id}/download.
          Modal chi tiết tự hiển thị nên chỉ hiện ở đây khi modal đã đóng. */}
      {!detailOpen && (
        <>
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
        </>
      )}

      <div className="posts-toolbar">
        <div className="posts-filter-chips">
          {[
            { value: "all", label: "Tất cả tài liệu" },
            { value: "free", label: "Miễn phí" },
            { value: "paid", label: "Trả phí" },
            { value: "mine", label: "Tài liệu của tôi" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                isMine && item.value === "mine"
                  ? "posts-chip posts-chip--active"
                  : !isMine && mode === item.value
                    ? "posts-chip posts-chip--active"
                    : "posts-chip"
              }
              aria-pressed={mode === item.value}
              onClick={() => onChangeMode(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ lọc chỉ áp dụng cho GET /api/library/documents */}
      {!isMine && (
        <DocumentFilter
          filters={filters}
          onChange={onFilterChange}
          onReset={onResetFilters}
        />
      )}

      <DocumentList
        documents={documents}
        loading={loading}
        error={error}
        currentUserId={currentUserId}
        downloadingId={downloadingId}
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
        onDelete={onDelete}
        onDownload={onDownload}
      />

      {formOpen && (
        <DocumentForm
          document={formDocument}
          saving={saving}
          error={error}
          onSubmit={onSubmitDocument}
          onClose={onCloseForm}
        />
      )}

      {detailOpen && (
        <DocumentDetail
          document={detail}
          loading={detailLoading}
          error={detailError}
          isOwner={isDetailOwner}
          downloading={downloadingId === detail?.id}
          downloadError={downloadError}
          downloadSuccess={downloadSuccess}
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          reviewsError={reviewsError}
          reviewsSaving={reviewsSaving}
          reviewsSuccess={reviewsSuccess}
          reviewFormError={reviewFormError}
          currentUserId={currentUserId}
          editingReviewId={editingReviewId}
          deletingReviewId={deletingReviewId}
          onEditReview={onEditReview}
          onCancelEditReview={onCancelEditReview}
          onDeleteReview={onDeleteReview}
          onSubmitReview={onSubmitReview}
          onSubmitEditReview={onSubmitEditReview}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
          onClose={onCloseDetail}
        />
      )}
    </>
  );
}