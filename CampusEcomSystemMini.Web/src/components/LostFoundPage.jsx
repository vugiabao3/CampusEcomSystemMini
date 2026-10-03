import LostFoundFilter from "./LostFoundFilter.jsx";
import LostFoundList from "./LostFoundList.jsx";
import LostFoundMap from "./LostFoundMap.jsx";

// Trang Campus Lost & Found.
// filter = "" | "Lost" | "Found" | "Returned"
//        ↓
// GET /api/lost-found?type=... hoặc ?status=Returned
//        ↓
// GET /api/lost-found/map
export default function LostFoundPage({
  filter,
  onFilterChange,
  items,
  loading,
  error,
  pins,
  mapLoading,
  mapError,
  onBack,
}) {
  return (
    <section className="pref-card posts-card lost-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">
            CAMPUS LOST & FOUND
          </span>

          <h1 className="pref-title">
            Đồ thất lạc
          </h1>

          <p className="pref-subtitle">
            Theo dõi đồ bị mất, đồ nhặt được và các vị trí
            đồ thất lạc trên campus.
          </p>
        </div>

        <span className="pref-status pref-status--ready">
          {items?.length ?? 0} tin
        </span>
      </div>

      <LostFoundFilter
        filter={filter}
        onChange={onFilterChange}
      />

      <div className="posts-toolbar">
        <button
          className="text-button"
          type="button"
          onClick={onBack}
        >
          Quay lại hồ sơ
        </button>
      </div>

      <LostFoundList
        items={items}
        loading={loading}
        error={error}
      />

      <div className="lost-map-section">
        <span className="posts-filter-label">
          Campus Map
        </span>

        <LostFoundMap
          pins={pins}
          loading={mapLoading}
          error={mapError}
        />
      </div>
    </section>
  );
}