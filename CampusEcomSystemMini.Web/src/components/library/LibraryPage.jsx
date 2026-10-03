import BookExchangePanel from "./BookExchangePanel.jsx";
import DocumentPanel from "./DocumentPanel.jsx";

// Trang KHO TÀI LIỆU & SÁCH — MODULE 4.
//
// [Sàn đổi sách]  → Batch 1: /api/library/books
// [Tài liệu số]   → Batch 2: /api/library/documents
//
// Tải tài liệu, đánh giá và giao dịch điểm thuộc các batch sau.
const SECTIONS = [
  { value: "books", label: "Sàn đổi sách", title: "Sàn đổi sách" },
  {
    value: "documents",
    label: "Tài liệu số",
    title: "Kho tài liệu số",
  },
];

const SECTION_HINTS = {
  books:
    "Đăng sách bạn đang có và sách bạn đang tìm, hệ thống tự ghép các bài đăng đổi sách phù hợp.",
  documents:
    "Chia sẻ tài liệu học tập với sinh viên trong trường. Tài liệu trả phí được tải bằng điểm.",
};

export default function LibraryPage({
  section,
  onChangeSection,
  count,
  onCreate,
  success,
  onBack,
  bookExchange,
  documentPanel,
}) {
  const isDocuments = section === "documents";

  const activeSection =
    SECTIONS.find((item) => item.value === section) ??
    SECTIONS[0];

  return (
    <section className="pref-card posts-card library-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">KHO TÀI LIỆU & SÁCH</span>

          <h1 className="pref-title">{activeSection.title}</h1>

          <p className="pref-subtitle">
            {SECTION_HINTS[activeSection.value]}
          </p>
        </div>

        <div className="posts-head-actions">
          <span className="pref-status pref-status--ready">
            {count} {isDocuments ? "tài liệu" : "bài đăng"}
          </span>

          <button
            className="btn btn-primary posts-primary-btn"
            type="button"
            onClick={onCreate}
          >
            {isDocuments
              ? "Đăng tải tài liệu"
              : "Đăng đổi sách"}
          </button>
        </div>
      </div>

      <div className="library-tabs">
        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>

        <div className="posts-filter-chips">
          {SECTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                section === item.value
                  ? "posts-chip posts-chip--active"
                  : "posts-chip"
              }
              aria-pressed={section === item.value}
              onClick={() => onChangeSection(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="message message-success" role="status">
          {success}
        </div>
      )}

      {isDocuments ? (
        <DocumentPanel {...documentPanel} />
      ) : (
        <BookExchangePanel {...bookExchange} />
      )}
    </section>
  );
}