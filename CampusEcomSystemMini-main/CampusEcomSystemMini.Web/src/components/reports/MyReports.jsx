// MyReports.jsx — Danh sách báo cáo của mình (MODULE_6 / BATCH 3)
function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status) {
  if (status === "Approved") {
    return "Đã duyệt";
  }

  if (status === "Rejected") {
    return "Đã từ chối";
  }

  return "Đang chờ duyệt";
}

function getStatusClass(status) {
  if (status === "Approved") {
    return "report-status report-status--approved";
  }

  if (status === "Rejected") {
    return "report-status report-status--rejected";
  }

  return "report-status report-status--pending";
}

export default function MyReports({
  reports,
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="posts-state">
        Đang tải danh sách báo cáo...
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

  if (!reports || reports.length === 0) {
    return (
      <div className="posts-state posts-state--empty">
        <span className="posts-state-icon">📋</span>

        <h3 className="posts-state-title">Chưa có báo cáo nào</h3>

        <p className="posts-state-text">
          Bạn chưa báo cáo bài đăng nào.
        </p>
      </div>
    );
  }

  return (
    <div className="my-reports">
      <div className="my-reports-head">
        <span className="eyebrow">BÁO CÁO CỦA BẠN</span>

        <span className="my-reports-count">
          {reports.length} báo cáo
        </span>
      </div>

      <ul className="report-list">
        {reports.map((report) => (
          <li key={report.id} className="report-item">
            <div className="report-item-main">
              <span className="report-item-reason">
                {report.reason || "—"}
              </span>

              <span className="report-item-meta">
                <span className="report-item-post">
                  Bài đăng: {report.postId?.slice(0, 8)}...
                </span>

                <span className="report-item-time">
                  {formatDate(report.createdAt) || "—"}
                </span>
              </span>

              {report.description && (
                <p className="report-item-description">
                  {report.description}
                </p>
              )}
            </div>

            <div className="report-item-side">
              <span className={getStatusClass(report.status)}>
                {getStatusLabel(report.status)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}