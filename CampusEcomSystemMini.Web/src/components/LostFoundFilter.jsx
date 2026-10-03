import { LOST_FOUND_FILTERS } from "../services/lostFoundService.js";

// Bộ lọc của GET /api/lost-found?type=...&status=...
// Backend là nơi lọc dữ liệu, không lọc lại ở React.
export default function LostFoundFilter({ filter, onChange }) {
  const current = filter ?? "";

  return (
    <div className="posts-filters">
      <div className="posts-filter-group">
        <span className="posts-filter-label">
          Trạng thái đồ thất lạc
        </span>

        <div className="posts-filter-chips">
          {LOST_FOUND_FILTERS.map((item) => {
            const isActive = item.value === current;

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
                onClick={() => onChange(item.value)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}