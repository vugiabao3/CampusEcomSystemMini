using System.Collections.Immutable;

namespace CampusEcomSystemMini.Application.Matching.Normalization;

// Domain-specific alias / entity resolution maps.
// Keys are accent-insensitive, lowercased lookup forms produced by
// TextNormalizer.Normalize. Values are canonical display values.
//
// Keeping aliases in one maintainable dictionary per domain avoids
// scattering hardcoded comparisons across handlers and makes it safe
// to add future aliases without touching the matching algorithm.
public static class AliasMaps
{
    // =====================================================================
    // STUDY GROUP domain aliases
    // =====================================================================

    public static IReadOnlyDictionary<string, string> StudySubjects { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            // Canonical subjects (27 required options)
            ["cau truc du lieu va giai thuat"] = "Cấu trúc dữ liệu và giải thuật",
            ["ctdl va gt"] = "Cấu trúc dữ liệu và giải thuật",
            ["cau truc du lieu"] = "Cơ sở dữ liệu",
            ["co so du lieu"] = "Cơ sở dữ liệu",
            ["csdl"] = "Cơ sở dữ liệu",
            ["lap trinh huong doi tuong"] = "Lập trình hướng đối tượng",
            ["lthdt"] = "Lập trình hướng đối tượng",
            ["oop"] = "Lập trình hướng đối tượng",
            ["toan roi rac"] = "Toán rời rạc",
            ["giai tich 1"] = "Giải tích 1",
            ["giai tich 2"] = "Giải tích 2",
            ["giai tich 3"] = "Giải tích 3",
            ["dai so tuyen tinh"] = "Đại số tuyến tính",
            ["xac suat thong ke"] = "Xác suất thống kê",
            ["vat ly dai cuong"] = "Vật lý đại cương",
            ["triet hoc mac lenin"] = "Triết học Mác - Lênin",
            ["kinh te chinh tri mac lenin"] = "Kinh tế chính trị Mác - Lênin",
            ["chu nghia xa hoi khoa hoc"] = "Chủ nghĩa xã hội khoa học",
            ["tu tuong ho chi minh"] = "Tư tưởng Hồ Chí Minh",
            ["lich su dang cong san viet nam"] = "Lịch sử Đảng Cộng sản Việt Nam",
            ["phap lut dai cuong"] = "Pháp luật đại cương",
            ["khoa hoc quan ly"] = "Khoa học quản lý",
            ["quan tri hoc"] = "Quản trị học",
            ["ky thuat phan mem"] = "Kỹ thuật phần mềm",
            ["lap trinh mang"] = "Lập trình mạng",
            ["he dieu hanh"] = "Hệ điều hành",
            ["kien truc may tinh"] = "Kiến trúc máy tính",
            ["phat trien web"] = "Phát triển Web",
            ["lap trinh di dong"] = "Lập trình di động",
            ["an toan thong tin"] = "An toàn thông tin",
            ["tri tue nhan tao"] = "Trí tuệ nhân tạo",
            ["quan tri du an phan mem"] = "Quản trị dự án phần mềm",
            // Legacy aliases
            ["giai tich"] = "Giải tích",
            ["giai tich 1"] = "Giải tích 1",
            ["giai tich 2"] = "Giải tích 2",
            ["giai tich 3"] = "Giải tích 3",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyLanguages { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["c"] = "C",
            ["c++"] = "C++",
            ["c plus plus"] = "C++",
            ["cpp"] = "C++",
            ["c#"] = "C#",
            ["c sharp"] = "C#",
            ["csharp"] = "C#",
            ["java"] = "Java",
            ["python"] = "Python",
            ["javascript"] = "JavaScript",
            ["js"] = "JavaScript",
            ["java script"] = "JavaScript",
            ["node"] = "JavaScript",
            ["typescript"] = "TypeScript",
            ["ts"] = "TypeScript",
            ["php"] = "PHP",
            ["go"] = "Go",
            ["rust"] = "Rust",
            ["swift"] = "Swift",
            ["kotlin"] = "Kotlin",
            ["sql"] = "SQL",
            ["html/css"] = "HTML/CSS",
            ["html css"] = "HTML/CSS",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyGoals { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["on thi cuoi ky"] = "Ôn thi cuối kỳ",
            ["on thi"] = "Ôn thi cuối kỳ",
            ["giai bai tap ve nha"] = "Giải bài tập về nhà",
            ["bai tap ve nha"] = "Giải bài tập về nhà",
            ["lam do an mon hoc"] = "Làm đồ án môn học",
            ["do an mon hoc"] = "Làm đồ án môn học",
            ["lam do an tot nghiep"] = "Làm đồ án tốt nghiệp",
            ["do an tot nghiep"] = "Làm đồ án tốt nghiệp",
            ["luyen phong van thuc tap"] = "Luyện phỏng vấn thực tập / đi làm",
            ["luyen phong van di lam"] = "Luyện phỏng vấn thực tập / đi làm",
            ["tu hoc nang cao ky nang"] = "Tự học nâng cao kỹ năng",
            ["nghien cuu cong nghe moi"] = "Nghiên cứu công nghệ mới",
        // Legacy aliases
        ["on thi"] = "Ôn thi cuối kỳ",
        ["lam bai tap"] = "Giải bài tập về nhà",
        ["lam do an"] = "Làm đồ án môn học",
        ["do an"] = "Làm đồ án môn học",
        // Canonical dropdown labels (frontend sends these exact strings)
        ["luyen phong van thuc tap / di lam"] = "Luyện phỏng vấn thực tập / đi làm",
    }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyProficiency { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["moi bat dau"] = "Mới bắt đầu (Chưa biết gì / Số 0)",
            ["moi bat dau hoc"] = "Mới bắt đầu (Chưa biết gì / Số 0)",
            ["co ban"] = "Cơ bản (Đã học lý thuyết)",
            ["trung binh"] = "Trung bình (Code được bài tập cơ bản)",
            ["nang cao"] = "Nâng cao (Đã có kinh nghiệm làm dự án)",
            ["chuyen gia"] = "Chuyên gia / Đã đi làm thực tế",
            ["chuyen gia da di lam thuc te"] = "Chuyên gia / Đã đi làm thực tế",
            // Legacy aliases
            ["moi bat dau"] = "Mới bắt đầu (Chưa biết gì / Số 0)",
            ["co ban"] = "Cơ bản (Đã học lý thuyết)",
            ["nang cao"] = "Nâng cao (Đã có kinh nghiệm làm dự án)",
            ["chua biet"] = "Mới bắt đầu (Chưa biết gì / Số 0)",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyTime { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["buoi sang"] = "Buổi sáng (8h - 11h30)",
            ["sang"] = "Buổi sáng (8h - 11h30)",
            ["buoi chieu"] = "Buổi chiều (14h - 17h30)",
            ["chieu"] = "Buổi chiều (14h - 17h30)",
            ["buoi toi"] = "Buổi tối (19h - 22h)",
            ["toi"] = "Buổi tối (19h - 22h)",
            ["cuoi tuan"] = "Cuối tuần (Thứ 7 & Chủ nhật)",
            ["cuan"] = "Cuối tuần (Thứ 7 & Chủ nhát)",
            ["gio giac linh hoat"] = "Giờ giấc linh hoạt theo lịch rảnh",
            ["linh hoat lich ranh"] = "Giờ giấc linh hoạt theo lịch rảnh",
            // Legacy aliases
            ["buoi sang"] = "Buổi sáng (8h - 11h30)",
            ["buoi chieu"] = "Buổi chiều (14h - 17h30)",
            ["buoi toi"] = "Buổi tối (19h - 22h)",
            // Canonical dropdown labels (frontend sends these exact strings)
            ["buoi sang (8h - 11h30)"] = "Buổi sáng (8h - 11h30)",
            ["buoi chieu (14h - 17h30)"] = "Buổi chiều (14h - 17h30)",
            ["buoi toi (19h - 22h)"] = "Buổi tối (19h - 22h)",
            ["cuoi tuan (thu 7 & chu nhat)"] = "Cuối tuần (Thứ 7 & Chủ nhật)",
            ["gio giac linh hoat theo lich ranh"] = "Giờ giấc linh hoạt theo lịch rảnh",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyFormat { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["truc tiep"] = "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            ["hoc truc tiep"] = "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            ["offline"] = "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            ["truc tuyen"] = "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
            ["hoc truc tuyen"] = "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
            ["online"] = "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
            ["ket hop"] = "Kết hợp (Hybrid: Online kết hợp Offline)",
            ["hoc ket hop"] = "Kết hợp (Hybrid: Online kết hợp Offline)",
            ["hybrid"] = "Kết hợp (Hybrid: Online kết hợp Offline)",
            // Canonical dropdown labels (frontend sends these exact strings)
            ["truc tiep (offline tai truong, thu vien, quan cafe)"] = "Trực tiếp (Offline tại trường, thư viện, quán cafe)",
            ["truc tuyen (online qua zoom, discord, google meet)"] = "Trực tuyến (Online qua Zoom, Discord, Google Meet)",
            ["ket hop (hybrid: online ket hop offline)"] = "Kết hợp (Hybrid: Online kết hợp Offline)",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyMethod { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["thuc hanh code chung"] = "Thực hành code chung (Pair programming)",
            ["pair programming"] = "Thực hành code chung (Pair programming)",
            ["code chung"] = "Thực hành code chung (Pair programming)",
            ["giai bai tap"] = "Giải bài tập / Luyện đề thi",
            ["bai tap"] = "Giải bài tập / Luyện đề thi",
            ["luyen de thi"] = "Giải bài tập / Luyện đề thi",
            ["thao luan ly thue"] = "Thảo luận lý thuyết & thiết kế hệ thống",
            ["thiet ke he thong"] = "Thảo luận lý thuyết & thiết kế hệ thống",
            ["code review"] = "Code Review & Sửa lỗi (Debug)",
            ["sua loi"] = "Code Review & Sửa lỗi (Debug)",
            ["debug"] = "Code Review & Sửa lỗi (Debug)",
            ["thuyet trinh"] = "Thuyết trình & Chia sẻ kiến thức (Knowledge sharing)",
            ["chia share kinh thuc"] = "Thuyết trình & Chia sẻ kiến thức (Knowledge sharing)",
            // Legacy aliases
            ["thuc hanh code"] = "Thực hành code chung (Pair programming)",
            ["thao luan nhom"] = "Thảo luận lý thuyết & thiết kế hệ thống",
            // Canonical dropdown labels (frontend sends these exact strings)
            ["thuc hanh code chung (pair programming)"] = "Thực hành code chung (Pair programming)",
            ["giai bai tap / luyen de thi"] = "Giải bài tập / Luyện đề thi",
            ["thao luan ly thue & thiet ke he thong"] = "Thảo luận lý thuyết & thiết kế hệ thống",
            ["code review & sua loi (debug)"] = "Code Review & Sửa lỗi (Debug)",
            ["thuyet trinh & chia share ki thuc (knowledge sharing)"] = "Thuyết trình & Chia sẻ kiến thức (Knowledge sharing)",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> StudyFrequency { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["hang ngay"] = "Hàng ngày (7 ngày/tuần)",
            ["ngay"] = "Hàng ngày (7 ngày/tuần)",
            ["3 buoi mot tuan"] = "3 buổi/tuần",
            ["ba buoi mot tuan"] = "3 buổi/tuần",
            ["2 buoi mot tuan"] = "2 buổi/tuần",
            ["hai buoi mot tuan"] = "2 buổi/tuần",
            ["cuoi tuan"] = "Cuối tuần (Thứ 7 & Chủ nhật)",
            ["cuan"] = "Cuối tuần (Thứ 7 & Chủ nhát)",
            ["linh hoat"] = "Linh hoạt chạy theo deadline đồ án",
            ["linh hoat deadline"] = "Linh hoạt chạy theo deadline đồ án",
            // Legacy aliases
            ["hang ngay"] = "Hàng ngày (7 ngày/tuần)",
            ["ba buoi mot tuan"] = "3 buổi/tuần",
            ["cuoi tuan"] = "Cuối tuần (Thứ 7 & Chủ nhật)",
        }.ToImmutableDictionary();

    // =====================================================================
    // ROOMMATE domain aliases
    // =====================================================================

    public static IReadOnlyDictionary<string, string> RoomAreas { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["ba dinh"] = "Ba Đình",
            ["hoan kiem"] = "Hoàn Kiếm",
            ["tay ho"] = "Tây Hồ",
            ["long bien"] = "Long Biên",
            ["cau giay"] = "Cầu Giấy",
            ["dong da"] = "Đống Đa",
            ["hai ba trung"] = "Hai Bà Trưng",
            ["hoang mai"] = "Hoàng Mai",
            ["thanh xuan"] = "Thanh Xuân",
            ["nam tu liem"] = "Nam Từ Liêm",
            ["bac tu liem"] = "Bắc Từ Liêm",
            ["ha dong"] = "Hà Đông",
            // Legacy aliases
            ["quan 1"] = "Quận 1",
            ["binh thanh"] = "Bình Thạnh",
            ["thu duc"] = "Thủ Đức",
        }.ToImmutableDictionary();

    // Budget label -> BudgetRange mapping for dropdown selection.
    // Each label maps to a structured min/max VND range.
    public static IReadOnlyDictionary<string, BudgetRange> RoomBudgets { get; } =
        new Dictionary<string, BudgetRange>(StringComparer.OrdinalIgnoreCase)
        {
            ["duoi 2 trieu"] = new BudgetRange(0m, 2_000_000m),
            ["tu 2 den 3 trieu"] = new BudgetRange(2_000_000m, 3_000_000m),
            ["tu 3 den 4 trieu"] = new BudgetRange(3_000_000m, 4_000_000m),
            ["tu 4 den 5 trieu"] = new BudgetRange(4_000_000m, 5_000_000m),
            ["tren 5 trieu"] = new BudgetRange(5_000_000m, null),
            ["thoa thuan"] = new BudgetRange(null, null),
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> RoomTypes { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["phong tro khep kin"] = "Phòng trọ khép kín",
            ["phong tro khong khep kin"] = "Phòng trọ không khép kín",
            ["chung cu mini"] = "Chung cư mini / Căn hộ dịch vụ",
            ["can ho dich vu"] = "Chung cư mini / Căn hộ dịch vụ",
            ["chung cu nguyen can"] = "Chung cư nguyên căn",
            ["o ghep"] = "Ở ghép (Homestay / Dorm)",
            ["homestay"] = "Ở ghép (Homestay / Dorm)",
            ["dorm"] = "Ở ghép (Homestay / Dorm)",
            ["nha nguyen can"] = "Nhà nguyên căn / Tập thể",
            ["tap the"] = "Nhà nguyên căn / Tập thể",
            // Legacy aliases
            ["phong rieng"] = "Phòng trọ khép kín",
            ["chung cu mini"] = "Chung cư mini / Căn hộ dịch vụ",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> RoomSleepSchedules { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["ngu som"] = "Ngủ sớm (trước 23h)",
            ["ngu som truoc 23h"] = "Ngủ sớm (trước 23h)",
            ["ngu muon"] = "Ngủ muộn (sau 24h)",
            ["ngu muon sau 24h"] = "Ngủ muộn (sau 24h)",
            ["linh hoat"] = "Linh hoạt / Tùy hôm",
            ["tuy hom"] = "Linh hoạt / Tùy hôm",
            ["lam ca dem"] = "Làm ca đêm / Xoay ca",
            ["xoay ca"] = "Làm ca đêm / Xoay ca",
            // Legacy aliases
            ["linh hoat"] = "Linh hoạt / Tùy hôm",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> RoomCleanlinessLevels { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["rat sach se nan nap"] = "Rất sạch sẽ, ngăn nắp",
            ["rat nan nap"] = "Rất sạch sẽ, ngăn nắp",
            ["kha sach se"] = "Khá sạch sẽ",
            ["binh thuong"] = "Bình thường / Thoải mái",
            ["thoai mai"] = "Bình thường / Thoải mái",
            ["linh hoat"] = "Linh hoạt / Theo thỏa thuận",
            ["theo thoathuan"] = "Linh hoạt / Theo thỏa thuận",
            // Legacy aliases
            ["rat nan nap"] = "Rất sạch sẽ, ngăn nắp",
            ["binh thuong"] = "Bình thường / Thoải mái",
            ["linh hoat"] = "Linh hoạt / Theo thỏa thuận",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> RoomNoisePreferences { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["can rat yen tin"] = "Cần rất yên tĩnh",
            ["yen tat"] = "Cần rất yên tĩnh",
            ["yen tinh"] = "Cần rất yên tĩnh",
            ["binh thuong"] = "Mức độ bình thường",
            ["thich nao nhiet"] = "Thích náo nhiệt / Thoải mái",
            ["nao nhiet"] = "Thích náo nhiệt / Thoải mái",
            ["thoai mai"] = "Thích náo nhiệt / Thoải mái",
            // Legacy aliases
            ["yen tat"] = "Cần rất yên tĩnh",
            ["binh thuong"] = "Mức độ bình thường",
            ["thich nao nhiet"] = "Thích náo nhiệt / Thoải mái",
        }.ToImmutableDictionary();

    public static IReadOnlyDictionary<string, string> RoomCookingHabits { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["nau an thuong xuyen"] = "Nấu ăn thường xuyên",
            ["thuong xuyen"] = "Nấu ăn thường xuyên",
            ["thinh thoang nau"] = "Thỉnh thoảng nấu",
            ["thinh thoang"] = "Thỉnh thoảng nấu",
            ["khong nau an"] = "Không nấu ăn",
            ["khong nau"] = "Không nấu ăn",
            ["chi nau don gian"] = "Chỉ nấu đồ đơn giản",
            ["nau don gian"] = "Chỉ nấu đồ đơn giản",
            // Legacy aliases
            ["thuong xuyen"] = "Nấu ăn thường xuyên",
            ["thinh thoang"] = "Thỉnh thoảng nấu",
            ["khong nau"] = "Không nấu ăn",
        }.ToImmutableDictionary();

    // Amenities are multi-select; each canonical amenity maps to its aliases.
    public static IReadOnlyDictionary<string, string> RoomAmenities { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["dieu hoa"] = "Có điều hòa",
            ["may lanh"] = "Có điều hòa",
            ["ac"] = "Có điều hòa",
            ["nong lanh"] = "Có nóng lạnh",
            ["dieu hoa nog lanh"] = "Có nóng lạnh",
            ["may giat"] = "Có máy giặt",
            ["giat bao"] = "Có máy giặt",
            ["tu lanh"] = "Có tủ lạnh",
            ["cho xe"] = "Có chỗ để xe",
            ["bai xe"] = "Có chỗ để xe",
            ["xe om"] = "Có chỗ để xe",
            ["gio giac tu do"] = "Giờ giấc tự do / Không chung chủ",
            ["khong chung chu"] = "Giờ giấc tự do / Không chung chủ",
            ["ban cong"] = "Có ban công / Cửa sổ",
            ["cua so"] = "Có ban công / Cửa sổ",
            ["thang may"] = "Có thang máy",
            ["cho phep nuoi thu cung"] = "Cho phép nuôi thú cưng",
            ["thu cung"] = "Cho phép nuôi thú cưng",
            // Legacy aliases
            ["dieu hoa"] = "Có điều hòa",
            ["may giat"] = "Có máy giặt",
            ["cho xe"] = "Có chỗ để xe",
            ["wifi"] = "Có chỗ để xe",
        }.ToImmutableDictionary();

    // Resolve a single normalized value against a domain alias map.
    // Returns null when no alias matches.
    public static string? Resolve(
        string? normalizedValue,
        IReadOnlyDictionary<string, string> aliasMap)
    {
        if (normalizedValue is null)
        {
            return null;
        }

        if (aliasMap.TryGetValue(normalizedValue, out var canonical))
        {
            return canonical;
        }

        return null;
    }
}
