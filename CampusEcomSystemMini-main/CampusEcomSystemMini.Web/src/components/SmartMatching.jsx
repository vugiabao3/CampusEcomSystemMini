import { useState, useEffect, useCallback } from "react";

import StudentMatchList from "./StudentMatchList.jsx";
import BackButton from "./BackButton.jsx";
import MatchDetailModal from "./MatchDetailModal.jsx";
import RoomMatchList from "./RoomMatchList.jsx";
import RoomMatchDetailModal from "./RoomMatchDetailModal.jsx";
import MultiSelectDropdown from "./MultiSelectDropdown.jsx";

// =====================================================================
// Canonical option catalogs — must match backend AliasMaps exactly.
// These are the authoritative dropdown values for the new preference forms.
// =====================================================================

const STUDY_SUBJECTS = [
  "Cấu trúc dữ liệu và giải thuật",
  "Cơ sở dữ liệu",
  "Lập trình hướng đối tượng",
  "Toán rời rạc",
  "Giải tích 1",
  "Giải tích 2",
  "Giải tích 3",
  "Đại số tuyến tính",
  "Xác suất thống kê",
  "Vật lý đại cương",
  "Triết học Mác - Lênin",
  "Kinh tế chính trị Mác - Lênin",
  "Chủ nghĩa xã hội khoa học",
  "Tư tưởng Hồ Chí Minh",
  "Lịch sử Đảng Cộng sản Việt Nam",
  "Pháp luật đại cương",
  "Khoa học quản lý",
  "Quản trị học",
  "Kỹ thuật phần mềm",
  "Lập trình mạng",
  "Hệ điều hành",
  "Kiến trúc máy tính",
  "Phát triển Web",
  "Lập trình di động",
  "An toàn thông tin",
  "Trí tuệ nhân tạo",
  "Quản trị dự án phần mềm",
];

const STUDY_LANGUAGES = [
  "C",
  "C++",
  "C#",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML/CSS",
];

const STUDY_GOALS = [
  "Ôn thi cuối kỳ",
  "Giải bài tập về nhà",
  "Làm đồ án môn học",
  "Làm đồ án tốt nghiệp",
  "Luyện phỏng vấn thực tập / đi làm",
  "Tự học nâng cao kỹ năng",
  "Nghiên cứu công nghệ mới",
];

const STUDY_PROFICIENCY = [
  "Mới bắt đầu (Chưa biết gì / Số 0)",
  "Cơ bản (Đã học lý thuyết)",
  "Trung bình (Code được bài tập cơ bản)",
  "Nâng cao (Đã có kinh nghiệm làm dự án)",
  "Chuyên gia / Đã đi làm thực tế",
];

const STUDY_TIMES = [
  "Buổi sáng (8h - 11h30)",
  "Buổi chiều (14h - 17h30)",
  "Buổi tối (19h - 22h)",
  "Cuối tuần (Thứ 7 & Chủ nhật)",
  "Giờ giấc linh hoạt theo lịch rảnh",
];

const STUDY_FORMATS = [
  "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
  "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
  "Kết hợp (Hybrid: Online kết hợp Offline)",
];

const STUDY_METHODS = [
  "Thực hành code chung (Pair programming)",
  "Giải bài tập / Luyện đề thi",
  "Thảo luận lý thuyết & thiết kế hệ thống",
  "Code Review & Sửa lỗi (Debug)",
  "Thuyết trình & Chia sẻ kiến thức (Knowledge sharing)",
];

const STUDY_FREQUENCIES = [
  "Hàng ngày (7 ngày/tuần)",
  "3 buổi/tuần",
  "2 buổi/tuần",
  "Cuối tuần (Thứ 7 & Chủ nhật)",
  "Linh hoạt chạy theo deadline đồ án",
];

const ROOM_AREAS = [
  "Ba Đình",
  "Hoàn Kiếm",
  "Tây Hồ",
  "Long Biên",
  "Cầu Giấy",
  "Đống Đa",
  "Hai Bà Trưng",
  "Hoàng Mai",
  "Thanh Xuân",
  "Nam Từ Liêm",
  "Bắc Từ Liêm",
  "Hà Đông",
];

const ROOM_BUDGETS = [
  { label: "Dưới 2 triệu", raw: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { label: "Từ 2 – 3 triệu", raw: "Từ 2 – 3 triệu", min: 2_000_000, max: 3_000_000 },
  { label: "Từ 3 – 4 triệu", raw: "Từ 3 – 4 triệu", min: 3_000_000, max: 4_000_000 },
  { label: "Từ 4 – 5 triệu", raw: "Từ 4 – 5 triệu", min: 4_000_000, max: 5_000_000 },
  { label: "Trên 5 triệu", raw: "Trên 5 triệu", min: 5_000_000, max: null },
  { label: "Thỏa thuận", raw: "Thỏa thuận", min: null, max: null },
];

// Reconstruct the raw budget label from stored min/max VND values.
function findBudgetRaw(minVnd, maxVnd) {
  if (minVnd == null && maxVnd == null) return "Thỏa thuận";
  for (const b of ROOM_BUDGETS) {
    const minMatch = b.min == null ? true : b.min === minVnd;
    const maxMatch = b.max == null ? true : b.max === maxVnd;
    if (minMatch && maxMatch) return b.raw;
  }
  return "";
}

const ROOM_TYPES = [
  "Phòng trọ khép kín",
  "Phòng trọ không khép kín",
  "Chung cư mini / Căn hộ dịch vụ",
  "Chung cư nguyên căn",
  "Ở ghép (Homestay / Dorm)",
  "Nhà nguyên căn / Tập thể",
];

const ROOM_SLEEP_SCHEDULES = [
  "Ngủ sớm (trước 23h)",
  "Ngủ muộn (sau 24h)",
  "Linh hoạt / Tùy hôm",
  "Làm ca đêm / Xoay ca",
];

const ROOM_CLEANLINESS = [
  "Rất sạch sẽ, ngăn nắp",
  "Khá sạch sẽ",
  "Bình thường / Thoải mái",
  "Linh hoạt / Theo thỏa thuận",
];

const ROOM_NOISE = [
  "Cần rất yên tĩnh",
  "Mức độ bình thường",
  "Thích náo nhiệt / Thoải mái",
];

const ROOM_COOKING = [
  "Nấu ăn thường xuyên",
  "Thỉnh thoảng nấu",
  "Không nấu ăn",
  "Chỉ nấu đồ đơn giản",
];

const ROOM_AMENITIES = [
  "Có điều hòa",
  "Có nóng lạnh",
  "Có máy giặt",
  "Có tủ lạnh",
  "Có chỗ để xe",
  "Giờ giấc tự do / Không chung chủ",
  "Có ban công / Cửa sổ",
  "Có thang máy",
  "Cho phép nuôi thú cưng",
];

// Single-select dropdown used for single-value criteria.
// No internal label — the parent renders exactly one label per field.
function SingleSelectDropdown({ id, options, value, onChange, placeholder = "-- Chọn --", disabled = false }) {
  return (
    <select
      id={id}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="needs-vector__select"
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// SMART MATCHING — Tìm nhóm học / Tìm trọ & ở ghép.
// Hai tab độc lập: vector nhu cầu nhóm học và vector nhu cầu phòng trọ.
// Mỗi tab có form riêng, nút lưu riêng, nút tìm đối tác riêng.
export default function SmartMatching({
  preferences,
  mode,
  onChangeMode,
  matches,
  loading,
  error,
  detailOpen,
  detail,
  detailLoading,
  detailError,
  onOpenDetail,
  onCloseDetail,
  roomMatches,
  roomLoading,
  roomError,
  roomDetailOpen,
  roomDetail,
  roomDetailLoading,
  roomDetailError,
  onOpenRoomDetail,
  onCloseRoomDetail,
  onSave,
  onRunStudyMatching,
  onRunRoomMatching,
  onBack,
  onCreatePost,
}) {
  const isRoomMode = mode === "rooms";
  const currentMatches = isRoomMode ? roomMatches : matches;

  const [activeTab, setActiveTab] = useState(isRoomMode ? "room" : "study");

  // ---- Study form state ----
  const [studySubjects, setStudySubjects] = useState([]);
  const [studyLanguages, setStudyLanguages] = useState([]);
  const [studyGoal, setStudyGoal] = useState([]);
  const [studyProficiency, setStudyProficiency] = useState("");
  const [studyTime, setStudyTime] = useState([]);
  const [studyFormat, setStudyFormat] = useState([]);
  const [studyMethod, setStudyMethod] = useState([]);
  const [studyFrequency, setStudyFrequency] = useState("");
  const [studySaving, setStudySaving] = useState(false);
  const [studySaveError, setStudySaveError] = useState("");
  const [studySaveSuccess, setStudySaveSuccess] = useState("");

  // ---- Room form state ----
  const [roomArea, setRoomArea] = useState("");
  const [roomBudgetRaw, setRoomBudgetRaw] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomSleepSchedule, setRoomSleepSchedule] = useState("");
  const [roomCleanliness, setRoomCleanliness] = useState("");
  const [roomNoisePreference, setRoomNoisePreference] = useState("");
  const [roomCookingHabits, setRoomCookingHabits] = useState("");
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomSaveError, setRoomSaveError] = useState("");
  const [roomSaveSuccess, setRoomSaveSuccess] = useState("");

  // Pre-fill forms from existing preferences.
  useEffect(() => {
    if (!preferences) return;

    setStudySubjects(Array.isArray(preferences.studySubjects) ? preferences.studySubjects : []);
    setStudyLanguages(Array.isArray(preferences.studyLanguages) ? preferences.studyLanguages : []);
    setStudyGoal(preferences.studyGoal ? String(preferences.studyGoal).split(", ").filter(Boolean) : []);
    setStudyProficiency(preferences.studyProficiency || "");
    setStudyTime(preferences.studyTime ? String(preferences.studyTime).split(", ").filter(Boolean) : []);
    setStudyFormat(preferences.studyFormat ? String(preferences.studyFormat).split(", ").filter(Boolean) : []);
    setStudyMethod(preferences.studyMethod ? String(preferences.studyMethod).split(", ").filter(Boolean) : []);
    setStudyFrequency(preferences.studyFrequency || "");

    setRoomArea(preferences.roomArea || "");
    setRoomBudgetRaw(preferences.roomBudgetRaw || findBudgetRaw(preferences.roomBudgetMin, preferences.roomBudgetMax) || "");
    setRoomType(preferences.roomType || "");
    setRoomSleepSchedule(preferences.roomSleepSchedule || "");
    setRoomCleanliness(preferences.roomCleanliness || "");
    setRoomNoisePreference(preferences.roomNoisePreference || "");
    setRoomCookingHabits(preferences.roomCookingHabits || "");
    setRoomAmenities(Array.isArray(preferences.roomAmenities) ? preferences.roomAmenities : []);
  }, [preferences]);

  // ---- Study handlers ----
  const handleSaveStudy = async (e) => {
    e.preventDefault();
    setStudySaveError("");
    setStudySaveSuccess("");

    const hasStudyValue =
      studySubjects.length > 0 ||
      studyLanguages.length > 0 ||
      studyGoal.trim() ||
      studyProficiency.trim() ||
      studyTime.trim() ||
      studyFormat.trim() ||
      studyMethod.trim() ||
      studyFrequency.trim();

    if (!hasStudyValue) {
      setStudySaveError("Vui lòng điền ít nhất một tiêu chí nhóm học.");
      return;
    }

    setStudySaving(true);

    try {
      const payload = {
        studySubjects: studySubjects.length > 0 ? studySubjects : null,
        studyLanguages: studyLanguages.length > 0 ? studyLanguages : null,
        studyGoal: studyGoal.length > 0 ? studyGoal.join(", ") : null,
        studyProficiency: studyProficiency.trim() || null,
        studyTime: studyTime.length > 0 ? studyTime.join(", ") : null,
        studyFormat: studyFormat.length > 0 ? studyFormat.join(", ") : null,
        studyMethod: studyMethod.length > 0 ? studyMethod.join(", ") : null,
        studyFrequency: studyFrequency.trim() || null,
      };

      await onSave(payload);
      setStudySaveSuccess("Vector nhu cầu nhóm học đã được lưu.");
    } catch (err) {
      setStudySaveError(err.message || "Lưu vector nhu cầu nhóm học thất bại.");
    } finally {
      setStudySaving(false);
    }
  };

  const handleRunStudyMatching = () => {
    if (onRunStudyMatching) onRunStudyMatching();
  };

  // ---- Room handlers ----
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setRoomSaveError("");
    setRoomSaveSuccess("");

    const hasRoomValue =
      roomArea.length > 0 ||
      roomBudgetRaw.trim() ||
      roomType.trim() ||
      roomSleepSchedule.trim() ||
      roomCleanliness.trim() ||
      roomNoisePreference.trim() ||
      roomCookingHabits.trim() ||
      roomAmenities.length > 0;

    if (!hasRoomValue) {
      setRoomSaveError("Vui lòng điền ít nhất một tiêu chí tìm trọ / ở ghép.");
      return;
    }

    setRoomSaving(true);

    try {
      const payload = {
        roomArea: roomArea.trim() || null,
        roomBudgetRaw: roomBudgetRaw.trim() || null,
        roomType: roomType.trim() || null,
        roomSleepSchedule: roomSleepSchedule.trim() || null,
        roomCleanliness: roomCleanliness.trim() || null,
        roomNoisePreference: roomNoisePreference.trim() || null,
        roomCookingHabits: roomCookingHabits.trim() || null,
        roomAmenities: roomAmenities.length > 0 ? roomAmenities : null,
      };

      await onSave(payload);
      setRoomSaveSuccess("Vector nhu cầu tìm trọ / ở ghép đã được lưu.");
    } catch (err) {
      setRoomSaveError(err.message || "Lưu vector nhu cầu tìm trọ / ở ghép thất bại.");
    } finally {
      setRoomSaving(false);
    }
  };

  const handleRunRoomMatching = () => {
    if (onRunRoomMatching) onRunRoomMatching();
  };

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost(isRoomMode ? "Room" : "Group");
    }
  };

  return (
    <section className="pref-card match-card-page">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">SMART MATCHING</span>
          <h1 className="pref-title">Vector nhu cầu</h1>
          <p className="pref-subtitle">
            Lựa chọn sở thích, thói quen và mục tiêu của bạn để hệ thống
            tìm nhóm học tập và bạn ở ghép phù hợp.
          </p>
        </div>
        <span className="pref-status pref-status--ready">
          {currentMatches?.length ?? 0} gợi ý
        </span>
      </div>

      {/* Domain tabs */}
      <div className="match-tabs" role="tablist">
        <button
          className={`match-tab ${activeTab === "study" ? "match-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "study"}
          onClick={() => setActiveTab("study")}
        >
          Vector nhu cầu nhóm học
        </button>
        <button
          className={`match-tab ${activeTab === "room" ? "match-tab--active" : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "room"}
          onClick={() => setActiveTab("room")}
        >
          Vector nhu cầu phòng trọ
        </button>
      </div>

      {/* Study form tab */}
      {activeTab === "study" && (
        <>
          {error && (
            <div className="message message-error" role="alert">{error}</div>
          )}
          {studySaveError && (
            <div className="message message-error" role="alert">{studySaveError}</div>
          )}
          {studySaveSuccess && (
            <div className="message message-success" role="status">{studySaveSuccess}</div>
          )}

          <h2 className="section-title">Vector nhu cầu nhóm học</h2>
          <p className="section-desc">
            Chọn môn học, ngôn ngữ, mục tiêu và thói quen học tập của bạn.
          </p>

          <form className="pref-form" onSubmit={handleSaveStudy}>
            <div className="pref-grid">
              <div className="form-group needs-vector-field">
                <label htmlFor="pref-study-subjects">Môn học</label>
                <MultiSelectDropdown
                  id="pref-study-subjects"
                  options={STUDY_SUBJECTS}
                  value={studySubjects}
                  onChange={setStudySubjects}
                  placeholder="-- Chọn môn học --"
                />
              </div>

              <div className="form-group needs-vector-field">
                <label htmlFor="pref-study-languages">Ngôn ngữ lập trình</label>
                <MultiSelectDropdown
                  id="pref-study-languages"
                  options={STUDY_LANGUAGES}
                  value={studyLanguages}
                  onChange={setStudyLanguages}
                  placeholder="-- Chọn ngôn ngữ --"
                />
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-goal">Mục tiêu</label>
                  <MultiSelectDropdown
                    id="pref-study-goal"
                    options={STUDY_GOALS}
                    value={studyGoal}
                    onChange={setStudyGoal}
                    placeholder="-- Chọn mục tiêu --"
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-proficiency">Trình độ</label>
                  <SingleSelectDropdown
                    id="pref-study-proficiency"
                    options={STUDY_PROFICIENCY}
                    value={studyProficiency}
                    onChange={setStudyProficiency}
                  />
                </div>
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-time">Thời gian học</label>
                  <MultiSelectDropdown
                    id="pref-study-time"
                    options={STUDY_TIMES}
                    value={studyTime}
                    onChange={setStudyTime}
                    placeholder="-- Chọn thời gian --"
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-format">Hình thức học</label>
                  <MultiSelectDropdown
                    id="pref-study-format"
                    options={STUDY_FORMATS}
                    value={studyFormat}
                    onChange={setStudyFormat}
                    placeholder="-- Chọn hình thức --"
                  />
                </div>
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-method">Phương pháp học</label>
                  <MultiSelectDropdown
                    id="pref-study-method"
                    options={STUDY_METHODS}
                    value={studyMethod}
                    onChange={setStudyMethod}
                    placeholder="-- Chọn phương pháp --"
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-study-frequency">Tần suất học</label>
                  <SingleSelectDropdown
                    id="pref-study-frequency"
                    options={STUDY_FREQUENCIES}
                    value={studyFrequency}
                    onChange={setStudyFrequency}
                  />
                </div>
              </div>
            </div>

            <div className="pref-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={studySaving}
              >
                {studySaving ? "Đang lưu..." : "Lưu vector nhóm học"}
              </button>

              <button
                className="btn btn-success"
                type="button"
                onClick={handleRunStudyMatching}
                disabled={studySaving}
              >
                {studySaving ? "Đang xử lý..." : "Tìm nhóm học phù hợp"}
              </button>

              <BackButton onClick={onBack} disabled={studySaving} />
            </div>
          </form>

          {!loading && (
            <StudentMatchList matches={matches} onOpenDetail={onOpenDetail} />
          )}

          {loading && (
            <div className="match-state">Đang tìm nhóm học phù hợp...</div>
          )}
        </>
      )}

      {/* Room form tab */}
      {activeTab === "room" && (
        <>
          {roomSaveError && (
            <div className="message message-error" role="alert">{roomSaveError}</div>
          )}
          {roomSaveSuccess && (
            <div className="message message-success" role="status">{roomSaveSuccess}</div>
          )}

          <h2 className="section-title">Vector nhu cầu phòng trọ</h2>
          <p className="section-desc">
            Chọn khu vực, ngân sách, loại phòng và thói quen sống của bạn.
          </p>

          <form className="pref-form" onSubmit={handleSaveRoom}>
            <div className="pref-grid">
              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-area">Khu vực</label>
                <SingleSelectDropdown
                  id="pref-room-area"
                  options={ROOM_AREAS}
                  value={roomArea}
                  onChange={setRoomArea}
                />
              </div>

              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-budget">Ngân sách thuê trọ</label>
                <select
                  id="pref-room-budget"
                  value={roomBudgetRaw}
                  onChange={(e) => setRoomBudgetRaw(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn ngân sách --</option>
                  {ROOM_BUDGETS.map((b) => (
                    <option key={b.raw} value={b.raw}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-type">Loại phòng</label>
                  <SingleSelectDropdown
                    id="pref-room-type"
                    options={ROOM_TYPES}
                    value={roomType}
                    onChange={setRoomType}
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-sleep">Giờ ngủ</label>
                  <SingleSelectDropdown
                    id="pref-room-sleep"
                    options={ROOM_SLEEP_SCHEDULES}
                    value={roomSleepSchedule}
                    onChange={setRoomSleepSchedule}
                  />
                </div>
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-cleanliness">Mức độ sạch sẽ</label>
                  <SingleSelectDropdown
                    id="pref-room-cleanliness"
                    options={ROOM_CLEANLINESS}
                    value={roomCleanliness}
                    onChange={setRoomCleanliness}
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-noise">Tiếng ồn</label>
                  <SingleSelectDropdown
                    id="pref-room-noise"
                    options={ROOM_NOISE}
                    value={roomNoisePreference}
                    onChange={setRoomNoisePreference}
                  />
                </div>
              </div>

              <div className="pref-grid--two">
                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-cooking">Nấu ăn</label>
                  <SingleSelectDropdown
                    id="pref-room-cooking"
                    options={ROOM_COOKING}
                    value={roomCookingHabits}
                    onChange={setRoomCookingHabits}
                  />
                </div>

                <div className="form-group needs-vector-field">
                  <label htmlFor="pref-room-amenities">Tiện ích</label>
                  <MultiSelectDropdown
                    id="pref-room-amenities"
                    options={ROOM_AMENITIES}
                    value={roomAmenities}
                    onChange={setRoomAmenities}
                    placeholder="-- Chọn tiện ích --"
                  />
                </div>
              </div>
            </div>

            <div className="pref-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={roomSaving}
              >
                {roomSaving ? "Đang lưu..." : "Lưu vector phòng trọ"}
              </button>

              <button
                className="btn btn-success"
                type="button"
                onClick={handleRunRoomMatching}
                disabled={roomSaving}
              >
                {roomSaving ? "Đang xử lý..." : "Tìm bạn ở ghép phù hợp"}
              </button>

              <BackButton onClick={onBack} disabled={roomSaving} />
            </div>
          </form>

          {!roomLoading && (
            <RoomMatchList matches={roomMatches} onOpenDetail={onOpenRoomDetail} />
          )}

          {roomLoading && (
            <div className="match-state">Đang tìm bạn ở ghép phù hợp...</div>
          )}
        </>
      )}

      <div className="posts-toolbar">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleCreatePost}
        >
          Đăng bài mới
        </button>

        <BackButton onClick={onBack} />
      </div>

      {detailOpen && (
        <MatchDetailModal
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={onCloseDetail}
        />
      )}

      {roomDetailOpen && (
        <RoomMatchDetailModal
          detail={roomDetail}
          loading={roomDetailLoading}
          error={roomDetailError}
          onClose={onCloseRoomDetail}
        />
      )}
    </section>
  );
}
