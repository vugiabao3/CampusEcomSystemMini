import { POST_TYPES, POST_TYPE_EMPTY } from "./postTypes.js";

// Bộ lọc của GET /api/posts?type=...&time=...
// Không tạo endpoint riêng cho từng bộ lọc.
const POST_TIME_FILTERS = [
  { value: "", label: "Tất cả thời gian" },
  { value: "Today", label: "Hôm nay" },
];

export default function PostFilters({ filters, onChange }) {
  const type = filters?.type ?? "";
  const time = filters?.time ?? "";

  function isActive(value, current) {
    return value === current;
  }

  return (
    <div className="posts-filters">
      <div className="posts-filter-group">
        <span className="posts-filter-label">
          Nhóm nội dung
        </span>

        <div className="posts-filter-chips">
          {[POST_TYPE_EMPTY, ...POST_TYPES].map((item) => (
            <button
              key={item.value || "empty"}
              type="button"
              className={
                isActive(item.value, type)
                  ? "posts-chip posts-chip--active"
                  : "posts-chip"
              }
              aria-pressed={isActive(item.value, type)}
              onClick={() =>
                onChange({ type: item.value, time })
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="posts-filter-group">
        <span className="posts-filter-label">
          Thời gian
        </span>

        <div className="posts-filter-chips">
          {POST_TIME_FILTERS.map((item) => (
            <button
              key={item.value || "all-time"}
              type="button"
              className={
                isActive(item.value, time)
                  ? "posts-chip posts-chip--active"
                  : "posts-chip"
              }
              aria-pressed={isActive(item.value, time)}
              onClick={() =>
                onChange({ type, time: item.value })
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {(type || time) && (
        <button
          className="posts-filter-reset"
          type="button"
          onClick={() =>
            onChange({ type: "", time: "" })
          }
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}