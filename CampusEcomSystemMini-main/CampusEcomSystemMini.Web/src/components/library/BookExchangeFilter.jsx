import { BOOK_STATUS_FILTERS } from "../../services/libraryService.js";

// Bộ lọc của GET /api/library/books?search=...&status=...
// Backend là nơi lọc dữ liệu, không lọc lại ở React.
export default function BookExchangeFilter({
  filters,
  onChange,
  onReset,
}) {
  const search = filters?.search ?? "";

  const status = filters?.status ?? "";

  function handleSearch(value) {
    onChange({ search: value, status });
  }

  function handleStatus(value) {
    onChange({ search, status: value });
  }

  return (
    <div className="posts-filters">
      <div className="posts-filter-group">
        <span className="posts-filter-label">Tìm theo tên sách</span>

        <input
          className="library-search"
          type="search"
          placeholder="Ví dụ: Giải tích"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="posts-filter-group">
        <span className="posts-filter-label">Trạng thái</span>

        <div className="posts-filter-chips">
          {BOOK_STATUS_FILTERS.map((item) => {
            const isActive = item.value === status;

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
                onClick={() => handleStatus(item.value)}
              >
                {item.label}
              </button>
            );
          })}

          {(search || status) && (
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
