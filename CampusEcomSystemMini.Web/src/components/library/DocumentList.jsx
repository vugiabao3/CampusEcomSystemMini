import DocumentCard from "./DocumentCard.jsx";

// Danh sách tài liệu số từ Backend,
// đã được lọc và sắp xếp sẵn ở Backend.
export default function DocumentList({
  documents,
  loading,
  error,
  currentUserId,
  downloadingId,
  onOpenDetail,
  onEdit,
  onDelete,
  onDownload,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải thư viện tài liệu...
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

  if (!documents || documents.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        Chưa có tài liệu nào phù hợp.
      </div>
    );
  }

  return (
    <div className="doc-list">
      {documents.map((document) => {
        const isOwner =
          Boolean(currentUserId) &&
          String(document?.userId ?? "").toLowerCase() ===
            String(currentUserId).toLowerCase();

        return (
          <DocumentCard
            key={document.id}
            document={document}
            isOwner={isOwner}
            downloading={downloadingId === document.id}
            onOpenDetail={onOpenDetail}
            onEdit={onEdit}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        );
      })}
    </div>
  );
}