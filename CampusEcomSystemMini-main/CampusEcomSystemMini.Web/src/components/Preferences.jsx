import { useState, useEffect } from "react";

import BackButton from "./BackButton.jsx";
import MultiSelectDropdown from "./MultiSelectDropdown.jsx";

// ============================================================================
// Canonical option catalogs — must match backend AliasMaps exactly.
// These are the authoritative dropdown values for the preference forms.
// ============================================================================

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
  { label: "Dưới 2 triệu", value: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { label: "Từ 2 – 3 triệu", value: "Từ 2 – 3 triệu", min: 2_000_000, max: 3_000_000 },
  { label: "Từ 3 – 4 triệu", value: "Từ 3 – 4 triệu", min: 3_000_000, max: 4_000_000 },
  { label: "Từ 4 – 5 triệu", value: "Từ 4 – 5 triệu", min: 4_000_000, max: 5_000_000 },
  { label: "Trên 5 triệu", value: "Trên 5 triệu", min: 5_000_000, max: null },
  { label: "Thỏa thuận", value: "Thỏa thuận", min: null, max: null },
];

function findBudgetRaw(minVnd, maxVnd) {
  if (minVnd == null && maxVnd == null) return "Thỏa thuận";
  for (const b of ROOM_BUDGETS) {
    const minMatch = b.min == null ? true : b.min === minVnd;
    const maxMatch = b.max == null ? true : b.max === maxVnd;
    if (minMatch && maxMatch) return b.value;
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

// ============================================================================
// Màn hình "Vector nhu cầu" — hai phân mục độc lập: nhóm học + tìm trọ / ở ghép.
// Trường đơn lựa dùng <select> nguyên bản. Trường đa lựa dùng MultiSelectDropdown
// (dropdown compact, không checkbox, không tick mark). Mỗi lần lưu, payload
// chứa đầy đủ cả hai phân mục để không bị ghi đè dữ liệu của phân mục kia.
// ============================================================================

export default function Preferences({
  preferences,
  loading,
  saving,
  error,
  success,
  onSave,
  onDelete,
  onBack,
}) {
  const hasPreferences = Boolean(preferences);

  const initialStudySubjects = Array.isArray(
    preferences?.studySubjects
  )
    ? preferences.studySubjects
    : [];
  const initialStudyLanguages = Array.isArray(
    preferences?.studyLanguages
  )
    ? preferences.studyLanguages
    : [];
  const initialStudyGoal = preferences?.studyGoal
    ? String(preferences.studyGoal).split(", ").filter(Boolean)
    : [];
  const initialStudyProficiency = preferences?.studyProficiency || "";
  const initialStudyTime = preferences?.studyTime
    ? String(preferences.studyTime).split(", ").filter(Boolean)
    : [];
  const initialStudyFormat = preferences?.studyFormat
    ? String(preferences.studyFormat).split(", ").filter(Boolean)
    : [];
  const initialStudyMethod = preferences?.studyMethod
    ? String(preferences.studyMethod).split(", ").filter(Boolean)
    : [];
  const initialStudyFrequency = preferences?.studyFrequency || "";

  const initialRoomArea = preferences?.roomArea || "";
  const initialRoomBudgetRaw =
    preferences?.roomBudgetRaw ||
    findBudgetRaw(preferences?.roomBudgetMin, preferences?.roomBudgetMax) ||
    "";
  const initialRoomType = preferences?.roomType || "";
  const initialRoomSleepSchedule = preferences?.roomSleepSchedule || "";
  const initialRoomCleanliness = preferences?.roomCleanliness || "";
  const initialRoomNoisePreference = preferences?.roomNoisePreference || "";
  const initialRoomCookingHabits = preferences?.roomCookingHabits || "";
  const initialRoomAmenities = Array.isArray(preferences?.roomAmenities)
    ? preferences.roomAmenities
    : [];

  // ---- Study form state ----
  const [studySubjects, setStudySubjects] = useState(initialStudySubjects);
  const [studyLanguages, setStudyLanguages] = useState(initialStudyLanguages);
  const [studyGoal, setStudyGoal] = useState(initialStudyGoal);
  const [studyProficiency, setStudyProficiency] = useState(
    initialStudyProficiency
  );
  const [studyTime, setStudyTime] = useState(initialStudyTime);
  const [studyFormat, setStudyFormat] = useState(initialStudyFormat);
  const [studyMethod, setStudyMethod] = useState(initialStudyMethod);
  const [studyFrequency, setStudyFrequency] = useState(initialStudyFrequency);
  const [studySaving, setStudySaving] = useState(false);
  const [studySaveError, setStudySaveError] = useState("");
  const [studySaveSuccess, setStudySaveSuccess] = useState("");

  // ---- Room form state ----
  const [roomArea, setRoomArea] = useState(initialRoomArea);
  const [roomBudgetRaw, setRoomBudgetRaw] = useState(initialRoomBudgetRaw);
  const [roomType, setRoomType] = useState(initialRoomType);
  const [roomSleepSchedule, setRoomSleepSchedule] = useState(
    initialRoomSleepSchedule
  );
  const [roomCleanliness, setRoomCleanliness] = useState(
    initialRoomCleanliness
  );
  const [roomNoisePreference, setRoomNoisePreference] = useState(
    initialRoomNoisePreference
  );
  const [roomCookingHabits, setRoomCookingHabits] = useState(
    initialRoomCookingHabits
  );
  const [roomAmenities, setRoomAmenities] = useState(initialRoomAmenities);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomSaveError, setRoomSaveError] = useState("");
  const [roomSaveSuccess, setRoomSaveSuccess] = useState("");

  // Resync local state when the parent passes updated preferences (e.g. after save).
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
    setRoomBudgetRaw(
      preferences.roomBudgetRaw ||
        findBudgetRaw(preferences.roomBudgetMin, preferences.roomBudgetMax) ||
        ""
    );
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

      const saved = await onSave(payload);
      // Sync local state from authoritative server response so both domains
      // stay current and saving one vector never erases the other.
      if (saved) {
        setStudySubjects(Array.isArray(saved.studySubjects) ? saved.studySubjects : []);
        setStudyLanguages(Array.isArray(saved.studyLanguages) ? saved.studyLanguages : []);
        setStudyGoal(saved.studyGoal ? String(saved.studyGoal).split(", ").filter(Boolean) : []);
        setStudyProficiency(saved.studyProficiency || "");
        setStudyTime(saved.studyTime ? String(saved.studyTime).split(", ").filter(Boolean) : []);
        setStudyFormat(saved.studyFormat ? String(saved.studyFormat).split(", ").filter(Boolean) : []);
        setStudyMethod(saved.studyMethod ? String(saved.studyMethod).split(", ").filter(Boolean) : []);
        setStudyFrequency(saved.studyFrequency || "");
        setRoomArea(saved.roomArea || "");
        setRoomBudgetRaw(
          saved.roomBudgetRaw ||
            findBudgetRaw(saved.roomBudgetMin, saved.roomBudgetMax) ||
            ""
        );
        setRoomType(saved.roomType || "");
        setRoomSleepSchedule(saved.roomSleepSchedule || "");
        setRoomCleanliness(saved.roomCleanliness || "");
        setRoomNoisePreference(saved.roomNoisePreference || "");
        setRoomCookingHabits(saved.roomCookingHabits || "");
        setRoomAmenities(Array.isArray(saved.roomAmenities) ? saved.roomAmenities : []);
      }
      setStudySaveSuccess("Vector nhu cầu nhóm học đã được lưu.");
    } catch (err) {
      setStudySaveError(err.message || "Lưu vector nhu cầu nhóm học thất bại.");
    } finally {
      setStudySaving(false);
    }
  };

  // ---- Room handlers ----
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setRoomSaveError("");
    setRoomSaveSuccess("");

    const hasRoomValue =
      roomArea.trim() ||
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

      const saved = await onSave(payload);
      // Sync local state from authoritative server response so both domains
      // stay current and saving one vector never erases the other.
      if (saved) {
        setStudySubjects(Array.isArray(saved.studySubjects) ? saved.studySubjects : []);
        setStudyLanguages(Array.isArray(saved.studyLanguages) ? saved.studyLanguages : []);
        setStudyGoal(saved.studyGoal ? String(saved.studyGoal).split(", ").filter(Boolean) : []);
        setStudyProficiency(saved.studyProficiency || "");
        setStudyTime(saved.studyTime ? String(saved.studyTime).split(", ").filter(Boolean) : []);
        setStudyFormat(saved.studyFormat ? String(saved.studyFormat).split(", ").filter(Boolean) : []);
        setStudyMethod(saved.studyMethod ? String(saved.studyMethod).split(", ").filter(Boolean) : []);
        setStudyFrequency(saved.studyFrequency || "");
        setRoomArea(saved.roomArea || "");
        setRoomBudgetRaw(
          saved.roomBudgetRaw ||
            findBudgetRaw(saved.roomBudgetMin, saved.roomBudgetMax) ||
            ""
        );
        setRoomType(saved.roomType || "");
        setRoomSleepSchedule(saved.roomSleepSchedule || "");
        setRoomCleanliness(saved.roomCleanliness || "");
        setRoomNoisePreference(saved.roomNoisePreference || "");
        setRoomCookingHabits(saved.roomCookingHabits || "");
        setRoomAmenities(Array.isArray(saved.roomAmenities) ? saved.roomAmenities : []);
      }
      setRoomSaveSuccess("Vector nhu cầu tìm trọ / ở ghép đã được lưu.");
    } catch (err) {
      setRoomSaveError(err.message || "Lưu vector nhu cầu tìm trọ / ở ghép thất bại.");
    } finally {
      setRoomSaving(false);
    }
  };

  function handleDelete() {
    const confirmed = window.confirm(
      "Xóa toàn bộ vector nhu cầu của bạn? Hành động này không thể hoàn tác."
    );

    if (!confirmed) {
      return;
    }

    onDelete();
  }

  if (loading) {
    return (
      <section className="pref-card">
        <div className="pref-loading">Đang tải vector nhu cầu...</div>
      </section>
    );
  }

  return (
    <section className="pref-card">
      <div className="pref-heading">
        <div>
          <span className="eyebrow">VECTOR NHU CẦU</span>

          <h1 className="pref-title">Vector nhu cầu</h1>

          <p className="pref-subtitle">
            Lựa chọn sở thích, thói quen và mục tiêu của bạn để hệ thống
            gợi ý nhóm học tập và bạn ở ghép phù hợp. Mỗi phân mục lưu độc lập.
          </p>
        </div>

        <span
          className={
            hasPreferences
              ? "pref-status pref-status--ready"
              : "pref-status pref-status--empty"
          }
        >
          {hasPreferences ? "Đã thiết lập" : "Chưa thiết lập"}
        </span>
      </div>

      {error && (
        <div className="message message-error" role="alert">{error}</div>
      )}

      {success && (
        <div className="message message-success" role="status">{success}</div>
      )}

      {/* ====================================================================
         PHÂN MỤC 1: NHÓM HỌC TẬP
         ==================================================================== */}
      <div className="needs-vector-section">
        <h2 className="needs-vector-section-title">Vector nhu cầu nhóm học</h2>
        <p className="needs-vector-section-desc">
          Chọn môn học, ngôn ngữ, mục tiêu và thói quen học tập của bạn.
        </p>

        {studySaveError && (
          <div className="message message-error" role="alert">{studySaveError}</div>
        )}
        {studySaveSuccess && (
          <div className="message message-success" role="status">{studySaveSuccess}</div>
        )}

        <form className="pref-form needs-vector-form" onSubmit={handleSaveStudy}>
          <div className="pref-grid needs-vector-grid">
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
                <select
                  id="pref-study-proficiency"
                  value={studyProficiency || ""}
                  onChange={(e) => setStudyProficiency(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn trình độ --</option>
                  {STUDY_PROFICIENCY.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
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
                <select
                  id="pref-study-frequency"
                  value={studyFrequency || ""}
                  onChange={(e) => setStudyFrequency(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn tần suất --</option>
                  {STUDY_FREQUENCIES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pref-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={studySaving || saving}
            >
              {studySaving ? "Đang lưu..." : "Lưu vector nhóm học"}
            </button>
          </div>
        </form>
      </div>

      {/* ====================================================================
         PHÂN MỤC 2: PHÒNG TRỌ / Ở GHÉP
         ==================================================================== */}
      <div className="needs-vector-section">
        <h2 className="needs-vector-section-title">Vector nhu cầu phòng trọ</h2>
        <p className="needs-vector-section-desc">
          Chọn khu vực, ngân sách, loại phòng và thói quen sống của bạn.
        </p>

        {roomSaveError && (
          <div className="message message-error" role="alert">{roomSaveError}</div>
        )}
        {roomSaveSuccess && (
          <div className="message message-success" role="status">{roomSaveSuccess}</div>
        )}

        <form className="pref-form needs-vector-form" onSubmit={handleSaveRoom}>
          <div className="pref-grid needs-vector-grid">
            <div className="form-group needs-vector-field">
              <label htmlFor="pref-room-area">Khu vực</label>
              <select
                id="pref-room-area"
                value={roomArea || ""}
                onChange={(e) => setRoomArea(e.target.value)}
                className="needs-vector__select"
              >
                <option value="">-- Chọn khu vực --</option>
                {ROOM_AREAS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group needs-vector-field">
              <label htmlFor="pref-room-budget">Ngân sách thuê trọ</label>
              <select
                id="pref-room-budget"
                value={roomBudgetRaw || ""}
                onChange={(e) => setRoomBudgetRaw(e.target.value)}
                className="needs-vector__select"
              >
                <option value="">-- Chọn ngân sách --</option>
                {ROOM_BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pref-grid--two">
              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-type">Loại phòng</label>
                <select
                  id="pref-room-type"
                  value={roomType || ""}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn loại phòng --</option>
                  {ROOM_TYPES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-sleep">Giờ ngủ</label>
                <select
                  id="pref-room-sleep"
                  value={roomSleepSchedule || ""}
                  onChange={(e) => setRoomSleepSchedule(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn giờ ngủ --</option>
                  {ROOM_SLEEP_SCHEDULES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pref-grid--two">
              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-cleanliness">Mức độ sạch sẽ</label>
                <select
                  id="pref-room-cleanliness"
                  value={roomCleanliness || ""}
                  onChange={(e) => setRoomCleanliness(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn mức độ --</option>
                  {ROOM_CLEANLINESS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-noise">Tiếng ồn</label>
                <select
                  id="pref-room-noise"
                  value={roomNoisePreference || ""}
                  onChange={(e) => setRoomNoisePreference(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn mức độ --</option>
                  {ROOM_NOISE.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pref-grid--two">
              <div className="form-group needs-vector-field">
                <label htmlFor="pref-room-cooking">Nấu ăn</label>
                <select
                  id="pref-room-cooking"
                  value={roomCookingHabits || ""}
                  onChange={(e) => setRoomCookingHabits(e.target.value)}
                  className="needs-vector__select"
                >
                  <option value="">-- Chọn thói quen --</option>
                  {ROOM_COOKING.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
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
              disabled={roomSaving || saving}
            >
              {roomSaving ? "Đang lưu..." : "Lưu vector phòng trọ"}
            </button>
          </div>
        </form>
      </div>

      <div className="pref-actions">
        <BackButton onClick={onBack} disabled={saving} />

        {hasPreferences && (
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving ? "Đang xử lý..." : "Xóa vector nhu cầu"}
          </button>
        )}
      </div>
    </section>
  );
}
