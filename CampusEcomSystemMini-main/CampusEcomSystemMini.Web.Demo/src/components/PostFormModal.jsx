import { useState, useEffect, useRef, useCallback } from "react";
import { getLocationSuggestions } from "../services/lostFoundService.js";

import { POST_TYPES, POST_TYPE_EMPTY } from "./postTypes.js";

export default function PostFormModal({
  post,
  saving,
  error,
  onSubmit,
  onClose,
  defaultType = "",
}) {
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [type, setType] = useState(post?.type ?? normalizeLostFoundType(defaultType) ?? "");
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");

  const [location, setLocation] = useState(post?.location ?? "");
  const [lat, setLat] = useState(post?.lat ?? "");
  const [lng, setLng] = useState(post?.lng ?? "");
  const [placeId, setPlaceId] = useState(post?.placeId ?? "");

  const [secretQuestion, setSecretQuestion] = useState(post?.secretQuestion ?? "");
  const [secretAnswer, setSecretAnswer] = useState(post?.secretAnswer ?? "");

  const [coordsFromSuggestion, setCoordsFromSuggestion] = useState(false);
  const prevLocationRef = useRef(location);

  function normalizeLostFoundType(value) {
    if (!value) return value;

    const lower = value.toLowerCase();

    if (lower === "found") return "Found";

    if (lower === "lost") return "Lost";

    return value;
  }

  const isLostFound =
    type?.toLowerCase() === "lost" ||
    type?.toLowerCase() === "found";

  const isFoundType = type?.toLowerCase() === "found";

  const showLocation = isLostFound;

  function parseCoordinate(value) {
    const trimmed = String(value ?? "").trim();

    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);

    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const locationInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputWrapperRef = useRef(null);
  const modalCardRef = useRef(null);

  useEffect(() => {
    if (coordsFromSuggestion && prevLocationRef.current !== location) {
      setLat("");
      setLng("");
      setPlaceId("");
      setCoordsFromSuggestion(false);
    }
    prevLocationRef.current = location;
  }, [location, coordsFromSuggestion]);

  useEffect(() => {
    if (dropdownRef.current && inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      dropdownRef.current.style.top = `${rect.bottom}px`;
      dropdownRef.current.style.left = `${rect.left}px`;
      dropdownRef.current.style.width = `${rect.width}px`;
    }

    const card = modalCardRef.current;
    if (card) {
      card.addEventListener("scroll", repositionDropdown);
    }
    return () => {
      if (card) {
        card.removeEventListener("scroll", repositionDropdown);
      }
    };
  }, [location, suggestions.length, suggestionLoading, suggestionError]);

  const repositionDropdown = () => {
    if (dropdownRef.current && inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      dropdownRef.current.style.top = `${rect.bottom}px`;
      dropdownRef.current.style.left = `${rect.left}px`;
      dropdownRef.current.style.width = `${rect.width}px`;
    }
  };

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setSuggestionError("");
      setApiError("");
      return;
    }

    setSuggestionLoading(true);
    setSuggestionError("");
    setSelectedIndex(-1);

    try {
      const data = await getLocationSuggestions(query, 5);
      const list = Array.isArray(data) ? data : [];
      if (list.length === 0) {
        setSuggestionError("");
      }
      setSuggestions(list);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      const msg = err && err.message ? err.message : "Không thể tải gợi ý địa chỉ.";
      if (msg.includes("API key") || msg.includes("configuration") || msg.includes("401") || msg.includes("403")) {
        setApiError("Chưa cấu hình API Key Google Maps. Vui lòng liên hệ quản trị hệ thống.");
      } else {
        setSuggestionError("Không thể tải gợi ý địa chỉ.");
      }
      setSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }

    if (location.length >= 3) {
      const timeout = setTimeout(() => {
        fetchSuggestions(location);
      }, 300);

      setDebounceTimeout(timeout);
    } else {
      setSuggestions([]);
      setSuggestionError("");
      setDebounceTimeout(null);
    }

    return () => {
      if (debounceTimeout !== null) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [location, fetchSuggestions]);

  const handleSelectSuggestion = (suggestion) => {
    setLocation(suggestion.formattedAddress);
    setLat(suggestion.latitude !== undefined && suggestion.latitude !== null ? suggestion.latitude.toString() : "");
    setLng(suggestion.longitude !== undefined && suggestion.longitude !== null ? suggestion.longitude.toString() : "");
    setPlaceId(suggestion.placeId || "");
    setSuggestions([]);
    setSuggestionError("");
    setApiError("");
    setSelectedIndex(-1);
    setCoordsFromSuggestion(true);
  };

  const handleKeyDown = (event) => {
    if (suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setLocation(value);
    if (value && value.trim()) {
      setLat("");
      setLng("");
      setPlaceId("");
      setCoordsFromSuggestion(false);
    } else {
      setLat("");
      setLng("");
      setPlaceId("");
      setCoordsFromSuggestion(false);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");
    setApiError("");

    if (!title.trim()) {
      setValidationError("Vui lòng nhập tiêu đề bài đăng.");
      return;
    }

    if (!content.trim()) {
      setValidationError("Vui lòng nhập nội dung bài đăng.");
      return;
    }

    let parsedLat = null;
    let parsedLng = null;

    if (showLocation) {
      const hasLat = String(lat).trim() !== "";
      const hasLng = String(lng).trim() !== "";

      if (hasLat !== hasLng) {
        setValidationError("Vui lòng chọn một gợi ý địa chỉ để lấy toạ độ.");
        return;
      }

      if (hasLat) {
        parsedLat = parseCoordinate(lat);
        parsedLng = parseCoordinate(lng);

        if (
          Number.isNaN(parsedLat) ||
          Number.isNaN(parsedLng) ||
          parsedLat < -90 ||
          parsedLat > 90 ||
          parsedLng < -180 ||
          parsedLng > 180
        ) {
          setValidationError(
            "Toạ độ không hợp lệ. Vĩ độ trong khoảng -90..90, kinh độ trong khoảng -180..180."
          );
          return;
        }
      } else if (location && location.trim()) {
        setValidationError("Vui lòng chọn một gợi ý địa chỉ để tự động lấy toạ độ.");
        return;
      }
    }

    if (isFoundType) {
      if (!secretQuestion.trim()) {
        setValidationError("Vui lòng nhập câu hỏi bí mật.");
        return;
      }

      if (!secretAnswer.trim()) {
        setValidationError("Vui lòng nhập câu trả lời đúng.");
        return;
      }
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      type: normalizeLostFoundType(type),
      location: showLocation ? location.trim() : undefined,
      lat: showLocation ? parsedLat : undefined,
      lng: showLocation ? parsedLng : undefined,
      secretQuestion: isFoundType ? secretQuestion.trim() : undefined,
      secretAnswer: isFoundType ? secretAnswer.trim() : undefined,
    });
  }

  const getSuggestionIcon = () => "📍";

  const renderNoResults = () => (
    <div className="suggestion-item suggestion-item--muted" role="option" aria-disabled="true">
      Không tìm thấy gợi ý địa chỉ.
    </div>
  );

  const renderLoading = () => (
    <div className="suggestion-item suggestion-item--muted" role="option" aria-disabled="true">
      Đang tải gợi ý…
    </div>
  );

  const renderApiError = () => (
    <div className="suggestion-item suggestion-item--error" role="alert">
      {apiError || suggestionError}
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        ref={modalCardRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>

        <form className="auth-form modal-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="eyebrow">BÀI ĐĂNG</span>

            <h2>
              {isEdit ? "Sửa bài đăng" : "Đăng bài mới"}
            </h2>

            <p>
              Chia sẻ thông tin với sinh viên trong khuôn viên
              trường.
            </p>
          </div>

          {validationError && (
            <div className="message message-error" role="alert">
              {validationError}
            </div>
          )}

          {error && (
            <div className="message message-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="post-title">Tiêu đề</label>

            <input
              id="post-title"
              type="text"
              placeholder="Thuê & Ở ghép trọ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-type">Nhóm nội dung</label>

            <select
              id="post-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {[POST_TYPE_EMPTY, ...POST_TYPES].map((item) => (
                <option
                  key={item.value || "empty"}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="post-content">Nội dung</label>

            <textarea
              id="post-content"
              rows={6}
              placeholder="Mô tả chi tiết bài đăng của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {showLocation && (
            <div className="post-location-fields">
              <div className="form-group location-input-wrapper" ref={inputWrapperRef}>
                <label htmlFor="post-location">
                  Vị trí (tòa nhà / khu vực)
                </label>

                <div className="location-input-container">
                  <input
                    id="post-location"
                    type="text"
                    placeholder="Nhập địa chỉ… ví dụ: 72 Trần Đại Nghĩa, Hà Nội"
                    value={location}
                    onChange={handleLocationChange}
                    onKeyDown={handleKeyDown}
                    ref={locationInputRef}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={suggestions.length > 0}
                    aria-autocomplete="list"
                    aria-controls="location-suggestions-list"
                    aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
                  />
                  <span className="location-input-icon" aria-hidden="true">{getSuggestionIcon()}</span>
                </div>

                {apiError && (
                  <div className="message message-error" role="alert">
                    {apiError}
                  </div>
                )}
                {suggestionLoading && (
                  <div className="posts-state">Đang tải gợi ý…</div>
                )}
                {suggestionError && !apiError && (
                  <div className="message message-error" role="alert">
                    {suggestionError}
                  </div>
                )}
                {!suggestionLoading && !apiError && suggestions.length > 0 && (
                  <div
                    id="location-suggestions-list"
                    className="suggestions-dropdown"
                    ref={dropdownRef}
                    role="listbox"
                    aria-label="Gợi ý địa chỉ"
                  >
                    {suggestions.map((suggestion, index) => {
                      const isSelected = index === selectedIndex;
                      const mainText = suggestion.mainText || suggestion.formattedAddress;
                      const secondaryText = suggestion.secondaryText || "";
                      return (
                        <div
                          key={suggestion.placeId || index}
                          id={`suggestion-${index}`}
                          className={`suggestion-item${isSelected ? " suggestion-item--selected" : ""}`}
                          role="option"
                          aria-selected={isSelected}
                          onMouseMove={() => setSelectedIndex(index)}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="suggestion-address">{mainText}</div>
                          {secondaryText && (
                            <div className="suggestion-secondary">{secondaryText}</div>
                          )}
                          {!secondaryText && suggestion.formattedAddress !== mainText && (
                            <div className="suggestion-secondary">{suggestion.formattedAddress}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {!suggestionLoading && !apiError && !suggestionError && location.length >= 3 && suggestions.length === 0 && (
                  <div className="suggestions-dropdown" role="listbox" aria-label="Gợi ý địa chỉ">
                    {renderNoResults()}
                  </div>
                )}
              </div>

              <div className="post-coordinate-row">
                <div className="form-group">
                  <label htmlFor="post-lat">Vĩ độ (Lat)</label>
                  <input
                    id="post-lat"
                    type="number"
                    step="any"
                    placeholder="10.77690"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    readOnly={true}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="post-lng">Kinh độ (Lng)</label>
                  <input
                    id="post-lng"
                    type="number"
                    step="any"
                    placeholder="106.70090"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    readOnly={true}
                  />
                </div>
              </div>

              <p className="post-location-hint">
                Toạ độ dùng để hiển thị vị trí trên Campus
                Map. Để trống nếu chưa xác định được.
              </p>
            </div>
          )}

          {isFoundType && (
            <div className="post-secret-fields">
              <div className="form-group">
                <label htmlFor="post-secret-question">
                  Tạo câu hỏi bí mật
                </label>

                <input
                  id="post-secret-question"
                  type="text"
                  placeholder="Móc khóa có hình con vật gì và màu gì?"
                  value={secretQuestion}
                  onChange={(e) => setSecretQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-secret-answer">
                  Nhập câu trả lời đúng
                </label>

                <input
                  id="post-secret-answer"
                  type="text"
                  placeholder="Con mèo màu xanh"
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  required
                />
              </div>

              <p className="post-secret-hint">
                Câu hỏi sẽ hiển thị cho người bị mất đồ để xác minh.
                Câu trả lời được mã hoá và không bao giờ hiển thị lại.
              </p>
            </div>
          )}

          <div className="posts-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Đang lưu…"
                : isEdit
                  ? "Lưu thay đổi"
                  : "Đăng bài"}
            </button>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>

        {placeId && (
          <div className="google-attribution" aria-hidden="true">
            <span className="google-logo">G</span>
            <span className="google-text">Bản đồ Google</span>
          </div>
        )}
      </div>
    </div>
  );
}
