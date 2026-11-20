import BookExchangeDetail from "./BookExchangeDetail.jsx";
import BookExchangeFilter from "./BookExchangeFilter.jsx";
import BookExchangeForm from "./BookExchangeForm.jsx";
import BookExchangeList from "./BookExchangeList.jsx";
import BookExchangeMatches from "./BookExchangeMatches.jsx";

// Sàn đổi sách — MODULE 4 / BATCH 1.
//
// Sàn đổi sách
//   ↓
// GET /api/library/books           (tất cả bài đăng, có filter)
// GET /api/library/books/me        (bài đăng của tôi)
// GET /api/library/books/{id}      (chi tiết)
// GET /api/library/books/exchange-matches
// POST /api/library/books
// PUT  /api/library/books/{id}
// DELETE /api/library/books/{id}
export default function BookExchangePanel({
  mode,
  onChangeMode,
  books,
  user,
  loading,
  saving,
  error,
  filters,
  onFilterChange,
  onResetFilters,
  onEdit,
  onDelete,
  onSubmitBook,
  onOpenDetail,
  onCloseForm,
  onCloseDetail,
  formOpen,
  formBook,
  detailOpen,
  detail,
  detailLoading,
  detailError,
  matches,
  matchesLoading,
  matchesError,
  onOpenMatch,
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
      <div className="posts-toolbar">
        <div className="posts-filter-chips">
          <button
            type="button"
            className={
              isMine ? "posts-chip" : "posts-chip posts-chip--active"
            }
            aria-pressed={!isMine}
            onClick={() => onChangeMode("all")}
          >
            Tất cả bài đăng
          </button>

          <button
            type="button"
            className={
              isMine
                ? "posts-chip posts-chip--active"
                : "posts-chip"
            }
            aria-pressed={isMine}
            onClick={() => onChangeMode("mine")}
          >
            Bài đăng của tôi
          </button>
        </div>
      </div>

      {/* Bộ lọc chỉ áp dụng cho GET /api/library/books */}
      {!isMine && (
        <BookExchangeFilter
          filters={filters}
          onChange={onFilterChange}
          onReset={onResetFilters}
        />
      )}

      <BookExchangeList
        books={books}
        loading={loading}
        error={error}
        currentUserId={currentUserId}
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="book-match-section">
        <span className="posts-filter-label">
          Exchange Match
        </span>

        <p className="lost-note">
          Chuỗi đổi sách được ghép từ các bài đăng của bạn:
          một người có sách bạn cần và đang tìm sách bạn có
          (đổi trực tiếp), hoặc chuỗi A → B → C → A.
        </p>

        <BookExchangeMatches
          matches={matches}
          loading={matchesLoading}
          error={matchesError}
          onOpenDetail={onOpenMatch}
        />
      </div>

      {formOpen && (
        <BookExchangeForm
          book={formBook}
          saving={saving}
          error={error}
          onSubmit={onSubmitBook}
          onClose={onCloseForm}
        />
      )}

      {detailOpen && (
        <BookExchangeDetail
          book={detail}
          loading={detailLoading}
          error={detailError}
          isOwner={isDetailOwner}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onCloseDetail}
        />
      )}
    </>
  );
}