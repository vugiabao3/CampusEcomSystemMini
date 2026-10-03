import { DOCUMENT_PRICING_FILTERS } from "../../services/libraryService.js";

// Bộ lọc của GET /api/library/documents?search=...&subject=...&pricing=...
// Backend là nơi lọc dữ liệu, không lọc lại ở React.
export default function DocumentFilter({
  filters,
  onChange,
  onReset,
}) {
  const search = filters?.search ?? "";

  const subject = filters?.subject ?? "";

  const pricing = filters?.pricing ?? "";

  function handleChange(key, value) {
    onChange({ search, subject, pricing, [key]: value });
  }

  return (
    <div className="posts-filters">
      <div className="posts-filter-group">
        <span className="posts-filter-label">Tìm tài liệu</span>

        <input
          className="library-search"
          type="search"
          placeholder="Tên tài liệu hoặc mô tả..."
          value={search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      <div className="posts-filter-group">
        <span className="posts-filter-label">Môn học / khoa</span>

        <input
          className="library-search"
          type="search"
          placeholder="Ví dụ: Lap trinh"
          value={subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </div>

      <div className="posts-filter-group">
        <span className="posts-filter-label">Giá</span>

        <div className="posts-filter-chips">
          {DOCUMENT_PRICING_FILTERS.map((item) => {
            const isActive = item.value === pricing;

            return (
              <button
                key={item.value || "all"}
                type="button"
                className={
                  isActive
                    ? "posts-chip posts-chip--active"
                    : "posts-chip"
                }
                aria-pressed={isActive}
                onClick={() => handleChange("pricing", item.value)}
              >
                {item.label}
              </button>
            );
          })}

          {(search || subject || pricing) && (
            <button
              className="posts-filter-reset"
              type="button"
              onClick={onReset}
            >
              Xoá bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}