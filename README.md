# CampusEcomSystemMini

**Nền tảng tiện ích và kết nối sinh viên trong khuôn viên trường.**

CampusEcomSystemMini hỗ trợ sinh viên tìm bạn học, tìm người ở ghép, đăng tin thất lạc, trao đổi sách và tài liệu, nhắn tin và theo dõi điểm uy tín. Dự án gồm backend ASP.NET Core theo Clean Architecture và frontend React.

[Repository](https://github.com/vugiabao3/CampusEcomSystemMini) · [Tài liệu module](Docs/) · [Hướng dẫn phát triển](Docs/AI_GUIDE.md)

## Mục lục

- [Chức năng](#chức-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc và cấu trúc dự án](#kiến-trúc-và-cấu-trúc-dự-án)
- [Trạng thái mã nguồn](#trạng-thái-mã-nguồn)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Các nhóm API](#các-nhóm-api)
- [Lệnh phát triển](#lệnh-phát-triển)
- [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
- [Tài liệu và đóng góp](#tài-liệu-và-đóng-góp)

## Chức năng

Các thành phần dưới đây được mô tả theo mã nguồn trong repository; xem phần [Trạng thái mã nguồn](#trạng-thái-mã-nguồn) trước khi chạy.

| Module | Chức năng |
| --- | --- |
| **1. Tài khoản và hồ sơ** | Đăng ký, đăng nhập bằng JWT, đăng xuất; cập nhật hồ sơ, ảnh đại diện và mật khẩu; thiết lập nhu cầu cá nhân; quản lý và thích bài đăng. |
| **2. Smart Matching** | Gợi ý bạn học và người ở ghép theo nhu cầu; tính mức độ phù hợp bằng Cosine Similarity; xem danh sách và chi tiết kết quả ghép nối. |
| **3. Campus Lost & Found** | Đăng tin mất/nhặt được đồ; xem vị trí trên bản đồ; đặt câu hỏi bí mật; gửi, duyệt hoặc từ chối yêu cầu nhận đồ; xác nhận đã trả đồ. |
| **4. Thư viện và trao đổi** | Đăng, tìm và gợi ý trao đổi sách; tải lên tài liệu PDF/DOCX; tìm kiếm, đánh giá và tải tài liệu có watermark. |
| **5. Messenger và thông báo** | Gửi, chấp nhận hoặc từ chối lời mời kết nối; xem hội thoại và lịch sử tin nhắn; chat bằng SignalR; xem thông báo và đánh dấu đã đọc. |
| **6. Gamification và quản trị** | Điểm uy tín, lịch sử điểm, bảng xếp hạng; API báo cáo vi phạm; API quản trị người dùng, bài đăng và báo cáo. |

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Backend | C#, ASP.NET Core, **.NET 10** |
| Xử lý nghiệp vụ | MediatR 14, Command/Query/Handler |
| Cơ sở dữ liệu | SQL Server, Entity Framework Core 10, migrations |
| Xác thực | JWT Bearer; BCrypt để băm mật khẩu |
| Chat | ASP.NET Core SignalR, `@microsoft/signalr` |
| Frontend | React 19, Vite 8, JavaScript/JSX, CSS |
| Tài liệu API | Swagger / Swashbuckle |
| Bản đồ | Google Maps JavaScript API, tùy chọn cấu hình |

## Kiến trúc và cấu trúc dự án

Backend tổ chức theo **Clean Architecture**. Controller tiếp nhận HTTP request và chuyển yêu cầu tới MediatR; Application xử lý use case thông qua các interface; Infrastructure triển khai truy cập dữ liệu và dịch vụ kỹ thuật; Domain chứa entity và các khái niệm nghiệp vụ.

| Đường dẫn | Trách nhiệm |
| --- | --- |
| [`CampusEcomSystemMini.Api/`](CampusEcomSystemMini.Api/) | Controller, SignalR Hub, cấu hình JWT, CORS và Swagger. |
| [`CampusEcomSystemMini.Application/`](CampusEcomSystemMini.Application/) | Command, Query, Handler, Response và interface. |
| [`CampusEcomSystemMini.Domain/`](CampusEcomSystemMini.Domain/) | Entity và enum; độc lập với HTTP và EF Core. |
| [`CampusEcomSystemMini.Infrastructure/`](CampusEcomSystemMini.Infrastructure/) | DbContext, migrations, repository, băm mật khẩu, JWT, lưu tài liệu và watermark. |
| [`CampusEcomSystemMini.Web/`](CampusEcomSystemMini.Web/) | Ứng dụng React; UI trong `src/components/`, gọi API trong `src/services/`, kết nối chat trong `src/hubs/`, CSS trong `src/styles/`. |
| [`Docs/`](Docs/) | Tài liệu thiết kế và phạm vi của 6 module. |
| [`CampusEcomSystemMini.slnx`](CampusEcomSystemMini.slnx) | Solution gồm 4 project backend; frontend chạy riêng bằng npm. |

Project `Api` tham chiếu `Application` và `Infrastructure`; `Application` tham chiếu `Domain`; `Infrastructure` tham chiếu `Application` và sử dụng các kiểu từ `Domain`.

## Trạng thái mã nguồn

README được đối chiếu với commit [`9ef2d64`](https://github.com/vugiabao3/CampusEcomSystemMini/commit/9ef2d64a8b8a6e23cc3238a5e30cf4fd5505907d), ngày **03/10/2026**.

**Bản mã nguồn này còn lỗi cú pháp cần xử lý trước khi build và chạy:**

- `CampusEcomSystemMini.Infrastructure/DependencyInjection.cs` và `CampusEcomSystemMini.Infrastructure/Data/AppDbContext.cs` có ký tự thừa `<<<<<<`.
- Khối cấu hình `Notification` trong `AppDbContext.cs` đóng lambda sớm, khiến các lệnh dùng `entity` nằm ngoài phạm vi và dấu ngoặc không khớp. Cần kiểm tra lại cả khối này, không chỉ xóa ký tự thừa.
- `CampusEcomSystemMini.Web/src/components/HomePage.jsx` có ký tự `<` thừa trước `onOpenMessenger` trong danh sách props.

Một số giới hạn chức năng hiện tại:

- API quản trị và báo cáo đã có trong backend; frontend hiện chưa có trang quản trị hoặc giao diện gửi báo cáo tương ứng.
- Tải tài liệu trả phí bởi người khác còn dùng `UnavailablePointService`, nên giao dịch điểm khi mua tài liệu chưa hoạt động dù đã có điểm uy tín và bảng xếp hạng.
- Chưa có tài khoản Admin được seed sẵn. Tài khoản đăng ký mới có vai trò `User`.

Hướng dẫn dưới đây sử dụng đúng cấu hình và tên project trong repository. Việc chạy toàn bộ hệ thống vẫn cần xác nhận sau khi xử lý các lỗi trên và cấu hình SQL Server.

## Cài đặt và chạy

### 1. Chuẩn bị môi trường

- **.NET SDK 10**.
- **Node.js 22.13 trở lên trong nhánh 22, hoặc Node.js 24 trở lên**, kèm npm. Mức này đáp ứng yêu cầu của Vite và ESLint trong lockfile.
- **SQL Server** hoặc SQL Server Express đang hoạt động.
- **Git**.
- Công cụ **`dotnet-ef` 10.0.12**, khớp phiên bản EF Core của dự án.

Kiểm tra các công cụ:

```bash
dotnet --version
node --version
npm --version
git --version
```

### 2. Clone repository

```bash
git clone https://github.com/vugiabao3/CampusEcomSystemMini.git
cd CampusEcomSystemMini
```

Các lệnh backend bên dưới chạy từ thư mục gốc `CampusEcomSystemMini`.

### 3. Cấu hình backend

Trong [`CampusEcomSystemMini.Api/appsettings.json`](CampusEcomSystemMini.Api/appsettings.json), cập nhật các khóa tương ứng; giữ nguyên các cấu hình khác:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=CampusEcomSystemMiniDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "CHANGE_ME_TO_A_RANDOM_SECRET_AT_LEAST_32_BYTES"
  },
  "DocumentStorage": {
    "RootPath": "App_Data/documents"
  }
}
```

- Thay `Server` bằng tên SQL Server instance trên máy. Giá trị đang có trong repository là `.\SQLEXPRESS07`; ví dụ trên dùng `.\SQLEXPRESS`.
- `Trusted_Connection=True` sử dụng Windows Authentication. Nếu dùng SQL Authentication, thay bằng `User Id=...;Password=...;` với tài khoản của bạn.
- Thay giá trị mẫu `Jwt:Key` bằng khóa riêng dài tối thiểu 32 byte.
- `DocumentStorage:RootPath` là nơi lưu tài liệu tải lên. Thư mục này cần có quyền ghi cho ứng dụng.

### 4. Khôi phục package và build backend

Sau khi xử lý các lỗi cú pháp được nêu ở trên:

```bash
dotnet restore CampusEcomSystemMini.slnx
dotnet build CampusEcomSystemMini.slnx
```

### 5. Khởi tạo cơ sở dữ liệu

Cài EF Core CLI nếu chưa có:

```bash
dotnet tool install --global dotnet-ef --version 10.0.12
```

Nếu đã cài phiên bản khác, dùng `dotnet tool update --global dotnet-ef --version 10.0.12`.

Áp dụng các migrations có sẵn:

```bash
dotnet ef database update --project CampusEcomSystemMini.Infrastructure --startup-project CampusEcomSystemMini.Api
```

Migrations nằm trong project `Infrastructure`, còn `Api` là startup project cung cấp cấu hình kết nối. Không cần tạo migration mới khi cài dự án lần đầu.

### 6. Chạy backend

Tin cậy chứng chỉ HTTPS phát triển trên máy nếu chưa thực hiện:

```bash
dotnet dev-certs https --trust
```

Chạy API bằng profile HTTPS:

```bash
dotnet run --project CampusEcomSystemMini.Api --launch-profile https
```

| Dịch vụ | Địa chỉ |
| --- | --- |
| API qua HTTPS | `https://localhost:7123` |
| API qua HTTP | `http://localhost:5067` |
| Swagger UI | `https://localhost:7123/swagger` |
| SignalR Chat Hub | `https://localhost:7123/hubs/chat` |

Profile `https` đặt môi trường là `Development`, nơi Swagger được bật. README dùng HTTPS cho frontend vì backend có `UseHttpsRedirection()`.

### 7. Cấu hình và chạy frontend

Mở terminal thứ hai tại thư mục gốc dự án:

```bash
cd CampusEcomSystemMini.Web
npm ci
```

Tạo file **`CampusEcomSystemMini.Web/.env.local`** với nội dung:

```dotenv
VITE_API_BASE_URL=https://localhost:7123
```

Biến này được dùng cho cả REST API và SignalR. Giá trị là địa chỉ gốc của backend, không thêm `/api`. Nếu không khai báo, frontend mặc định gọi `http://localhost:5067`.

Để hiển thị bản đồ Google Maps, thêm khóa của bạn vào cùng file:

```dotenv
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Khóa Google Maps là tùy chọn. Khi chưa có khóa, trang Lost & Found vẫn hiển thị danh sách vị trí và tọa độ thay cho bản đồ.

Khởi động frontend:

```bash
npm run dev -- --port 5173 --strictPort
```

Mở **[http://localhost:5173](http://localhost:5173)**. Cổng được cố định để khớp với origin trong cấu hình CORS của backend. Khởi động lại Vite sau khi sửa `.env.local`.

## Hướng dẫn sử dụng

### Sinh viên

Sau khi hệ thống được cài đặt và khởi chạy, mở **http://localhost:5173** để truy cập ứng dụng.

#### 1. Đăng ký và đăng nhập

Nếu chưa có tài khoản:

1. Mở chức năng **Đăng ký**.
2. Nhập họ tên, email và mật khẩu.
3. Gửi thông tin đăng ký. Nếu email đã được sử dụng, hãy kiểm tra lại hoặc dùng email khác.
4. Khi đăng ký thành công, đăng nhập bằng email và mật khẩu vừa tạo.

Sau khi đăng nhập, bạn có thể sử dụng các chức năng dành cho sinh viên. Khi sử dụng xong, chọn **Đăng xuất** để kết thúc phiên làm việc.

#### 2. Cập nhật hồ sơ và nhu cầu cá nhân

Thông tin hồ sơ giúp người khác nhận biết bạn. Thông tin nhu cầu giúp hệ thống tìm người phù hợp để học cùng hoặc ở ghép.

**Cập nhật hồ sơ:**

1. Mở phần hồ sơ cá nhân.
2. Kiểm tra và cập nhật các thông tin mà biểu mẫu cho phép, chẳng hạn họ tên, số điện thoại và ảnh đại diện.
3. Lưu thay đổi.
4. Nếu muốn đổi mật khẩu, mở chức năng đổi mật khẩu và nhập thông tin theo yêu cầu.

**Thiết lập nhu cầu cá nhân:**

1. Mở phần thiết lập nhu cầu.
2. Điền các thông tin:

   | Thông tin | Cách điền |
   | --- | --- |
   | Thói quen | Mô tả sinh hoạt hoặc cách học của bạn, ví dụ thích học buổi tối, cần không gian yên tĩnh. |
   | Mục tiêu | Nêu điều bạn muốn đạt được, ví dụ tìm nhóm ôn thi hoặc học cùng môn lập trình. |
   | Khu vực thuê trọ | Nhập khu vực bạn muốn tìm phòng hoặc ở ghép. |
   | Ngân sách thuê trọ | Nhập số tiền dự kiến có thể chi trả mỗi tháng. |

3. Lưu thông tin sau khi điền xong.
4. Cập nhật lại khi nhu cầu thay đổi để kết quả ghép nối phù hợp hơn.

#### 3. Tìm bạn học hoặc người ở ghép bằng Smart Matching

**Smart Matching** là chức năng gợi ý người phù hợp dựa trên thông tin nhu cầu cá nhân.

1. Mở chức năng **Smart Matching**.
2. Chọn tìm bạn học hoặc tìm người ở ghép.
3. Xem danh sách gợi ý và mức độ phù hợp do hệ thống tính toán.
4. Mở chi tiết từng kết quả để xem thêm thông tin.
5. Nếu muốn trao đổi, sử dụng chức năng gửi lời mời kết nối.

Mức độ phù hợp là thông tin tham khảo. Bạn nên trò chuyện để xác nhận lịch học, thói quen, khu vực và chi phí trước khi quyết định học cùng hoặc ở ghép.

#### 4. Tạo và quản lý bài đăng

1. Mở phần bài đăng.
2. Chọn tạo bài đăng mới.
3. Chọn loại bài đăng và nhập nội dung theo biểu mẫu.
4. Kiểm tra thông tin trước khi đăng.
5. Mở danh sách bài đăng của mình để xem lại, chỉnh sửa hoặc xóa bài khi cần.

Bạn cũng có thể xem và thích bài đăng của người khác. Với tin mất hoặc nhặt được đồ, hãy chọn đúng loại bài để thông tin xuất hiện trong chức năng **Lost & Found**.

#### 5. Tìm đồ thất lạc và xử lý yêu cầu nhận đồ

**Lost & Found** hỗ trợ kết nối người bị mất đồ với người nhặt được đồ.

**Nếu bạn bị mất đồ:**

1. Tạo bài đăng mất đồ, mô tả rõ đặc điểm và địa điểm liên quan.
2. Mở **Lost & Found** để tìm các tin nhặt được đồ.
3. Xem mô tả, vị trí và các thông tin của bài đăng.
4. Nếu thấy món đồ có thể thuộc về mình, mở chức năng yêu cầu nhận đồ.
5. Trả lời câu hỏi bí mật và điền các thông tin được yêu cầu.
6. Gửi yêu cầu và chờ người đăng tin xem xét.

**Nếu bạn nhặt được đồ:**

1. Tạo bài đăng nhặt được đồ.
2. Mô tả món đồ và địa điểm nhặt được.
3. Đặt câu hỏi bí mật về một đặc điểm mà chủ sở hữu có thể biết.
4. Xem danh sách yêu cầu nhận đồ gửi đến bài đăng của mình.
5. Kiểm tra câu trả lời rồi chấp nhận hoặc từ chối yêu cầu.
6. Sau khi thực sự bàn giao món đồ, xác nhận **đã trả đồ** trên hệ thống.

**Xem vị trí:** Nếu đã cấu hình Google Maps, bạn có thể xem các vị trí có tọa độ trên bản đồ. Nếu chưa cấu hình, hệ thống hiển thị danh sách vị trí và tọa độ.

#### 6. Trao đổi sách và sử dụng thư viện tài liệu

**Trao đổi sách:**

1. Mở phần thư viện và chọn chức năng trao đổi sách.
2. Xem danh sách sách hoặc sử dụng các bộ lọc.
3. Mở chi tiết bài đăng để xem thông tin sách và nhu cầu trao đổi.
4. Nếu có sách muốn trao đổi, tạo bài đăng của mình.
5. Xem các gợi ý trao đổi và kết nối với người đăng để thỏa thuận.
6. Chỉnh sửa hoặc xóa bài đăng khi thông tin thay đổi hoặc không còn nhu cầu.

**Chia sẻ và tải tài liệu:**

1. Mở phần tài liệu trong thư viện.
2. Tìm tài liệu cần sử dụng và mở phần chi tiết.
3. Xem thông tin, đánh giá và điều kiện tải tài liệu.
4. Chọn tải xuống. Hệ thống xử lý watermark trước khi trả file.
5. Nếu muốn chia sẻ tài liệu, mở chức năng tải lên và điền thông tin theo biểu mẫu.
6. Chọn file **PDF hoặc DOCX**, có dung lượng tối đa **25 MB**, rồi gửi.
7. Bạn có thể đánh giá tài liệu và quản lý các tài liệu do mình đăng.

**Giới hạn hiện tại:** Việc tải tài liệu trả phí của người khác chưa được tích hợp giao dịch điểm. Có điểm uy tín không đồng nghĩa với việc đã có thể mua tài liệu bằng điểm.

#### 7. Kết nối và trò chuyện qua Messenger

Để bắt đầu trò chuyện với một người dùng khác:

1. Gửi lời mời kết nối tới người đó.
2. Chờ người nhận chấp nhận lời mời.
3. Khi kết nối được chấp nhận, mở **Messenger**.
4. Chọn cuộc hội thoại.
5. Nhập nội dung và gửi tin nhắn.

Bạn có thể xem lại lịch sử hội thoại. Tin nhắn mới được gửi và nhận qua SignalR khi kết nối chat hoạt động.

Với lời mời được gửi đến mình, mở phần yêu cầu kết nối để xem và chọn **chấp nhận** hoặc **từ chối**.

#### 8. Xem thông báo, điểm uy tín và bảng xếp hạng

**Thông báo:**

1. Mở danh sách thông báo.
2. Xem các thông báo chưa đọc.
3. Chọn thông báo để đọc nội dung.
4. Đánh dấu từng thông báo hoặc toàn bộ thông báo là đã đọc.

**Điểm uy tín và bảng xếp hạng:**

1. Mở chức năng điểm hoặc bảng xếp hạng.
2. Xem số điểm hiện tại của mình.
3. Xem lịch sử điểm để biết các lần được cộng hoặc trừ điểm.
4. Xem bảng xếp hạng và thứ hạng cá nhân.

Điểm uy tín được cập nhật theo các hoạt động và quy tắc mà backend đã tích hợp.

### Quản trị viên

Quản trị viên sử dụng các chức năng quản lý người dùng, bài đăng và báo cáo vi phạm.

**Phiên bản hiện tại chưa có trang quản trị riêng trên frontend.** Các thao tác quản trị được thực hiện thông qua **Swagger** hoặc công cụ gọi API như Postman.

#### 1. Chuẩn bị tài khoản quản trị

Tài khoản đăng ký thông thường có vai trò `User`. Để sử dụng chức năng quản trị:

1. Tạo một tài khoản trên hệ thống.
2. Nhờ người phụ trách cơ sở dữ liệu cấp vai trò `Admin` cho tài khoản đó.
3. Đăng nhập lại sau khi được cấp quyền.

Hệ thống chưa tạo sẵn tài khoản Admin mặc định.

Khi đăng nhập thành công, backend trả về **JWT token** — mã xác thực để hệ thống nhận biết tài khoản và quyền truy cập. Cần đăng nhập lại sau khi đổi vai trò vì token cũ vẫn chứa thông tin quyền tại thời điểm đăng nhập trước đó.

#### 2. Đăng nhập và xác thực trong Swagger

1. Khởi chạy backend bằng profile HTTPS.
2. Mở **https://localhost:7123/swagger**.
3. Tìm API `POST /api/auth/login`.
4. Chọn **Try it out**, nhập email và mật khẩu của tài khoản Admin theo biểu mẫu.
5. Chọn **Execute** để gửi yêu cầu.
6. Sao chép giá trị `token` trong kết quả đăng nhập.
7. Chọn **Authorize** trên Swagger và nhập token vào ô xác thực.
8. Xác nhận rồi mở nhóm API `/api/admin`.

Nếu dùng Postman hoặc công cụ tương tự, thêm header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Thay `<JWT_TOKEN>` bằng token đã nhận khi đăng nhập.

#### 3. Xem dashboard quản trị

1. Mở API `GET /api/admin/dashboard`.
2. Chọn **Try it out** rồi **Execute**.
3. Xem dữ liệu tổng hợp mà API trả về để nắm tình hình hệ thống.

Swagger hiển thị dữ liệu dưới dạng JSON. Đây là kết quả API, chưa phải màn hình dashboard trực quan.

#### 4. Quản lý người dùng

1. Gọi `GET /api/admin/users` để xem danh sách người dùng.
2. Lấy `id` của tài khoản cần kiểm tra.
3. Gọi `GET /api/admin/users/{id}` để xem chi tiết.
4. Nếu cần thay đổi trạng thái, gọi `PUT /api/admin/users/{id}/status`.
5. Nhập trạng thái theo request mẫu trong Swagger:

   | Trạng thái | Ý nghĩa |
   | --- | --- |
   | `Active` | Tài khoản đang hoạt động. |
   | `Blocked` | Tài khoản bị khóa. |

6. Gửi yêu cầu và kiểm tra kết quả trả về.

Trong đường dẫn API, `{id}` là chỗ điền mã của người dùng cần thao tác.

#### 5. Quản lý bài đăng

1. Gọi `GET /api/admin/posts` để xem danh sách bài đăng.
2. Lấy `id` của bài cần kiểm tra.
3. Gọi `GET /api/admin/posts/{id}` để xem nội dung chi tiết.
4. Nếu cần xóa bài đăng, gọi `DELETE /api/admin/posts/{id}`.
5. Kiểm tra kết quả và tải lại danh sách để xác nhận thay đổi.

Trước khi xóa, đối chiếu mã bài đăng, nội dung và người đăng để thực hiện đúng đối tượng.

#### 6. Xử lý báo cáo vi phạm

1. Gọi `GET /api/admin/reports` để xem danh sách báo cáo.
2. Lấy `id` của báo cáo cần xử lý.
3. Gọi `GET /api/admin/reports/{id}` để xem chi tiết.
4. Kiểm tra nội dung báo cáo và đối tượng bị báo cáo.
5. Chọn thao tác phù hợp:

   | Thao tác | API |
   | --- | --- |
   | Chấp nhận báo cáo | `PUT /api/admin/reports/{id}/approve` |
   | Từ chối báo cáo | `PUT /api/admin/reports/{id}/reject` |

6. Điền các trường được yêu cầu trong Swagger rồi gửi.
7. Xem lại báo cáo để kiểm tra trạng thái sau xử lý.

Chức năng tạo báo cáo hiện có ở backend qua `/api/reports`; frontend chưa có giao diện gửi báo cáo tương ứng.

#### 7. Khi không truy cập được chức năng quản trị

| Kết quả | Cách xử lý |
| --- | --- |
| `401 Unauthorized` | Kiểm tra đã nhập JWT chưa; nếu token hết hạn, đăng nhập lại và cập nhật token. |
| `403 Forbidden` | Kiểm tra tài khoản có vai trò `Admin`; nếu vừa được cấp quyền, đăng nhập lại. |
| Không tìm thấy người dùng, bài đăng hoặc báo cáo | Kiểm tra `{id}` đã nhập có đúng và đối tượng còn tồn tại hay không. |
| Request bị từ chối do dữ liệu không hợp lệ | Đối chiếu tên trường, kiểu dữ liệu và giá trị với request mẫu trong Swagger. |
## Các nhóm API

| Nhóm | Đường dẫn chính | Mục đích |
| --- | --- | --- |
| Xác thực | `/api/auth` | Register, login, thông tin đăng nhập, logout. |
| Hồ sơ và nhu cầu | `/api/users/me`, `/api/users/me/preferences` | Hồ sơ, ảnh đại diện, mật khẩu và nhu cầu cá nhân. |
| Bài đăng | `/api/posts` | Bài đăng, bài của tôi và lượt thích. |
| Ghép nối | `/api/matching/students`, `/api/matching/rooms` | Danh sách và chi tiết kết quả ghép nối. |
| Thất lạc | `/api/lost-found` | Danh sách, tọa độ, câu hỏi bí mật, yêu cầu nhận đồ và trả đồ. |
| Trao đổi sách | `/api/library/books` | Quản lý sách và gợi ý trao đổi. |
| Tài liệu | `/api/library/documents` | Upload, cập nhật, tải tài liệu và đánh giá. |
| Kết nối | `/api/connections/requests` | Gửi và xử lý lời mời kết nối. |
| Hội thoại | `/api/conversations` | Danh sách hội thoại và lịch sử tin nhắn. |
| Thông báo | `/api/notifications` | Thông báo, số chưa đọc và đánh dấu đã đọc. |
| Điểm | `/api/gamification` | Điểm cá nhân và lịch sử điểm. |
| Xếp hạng | `/api/leaderboard` | Bảng xếp hạng và thứ hạng cá nhân. |
| Báo cáo | `/api/reports` | Tạo báo cáo và xem báo cáo của tôi. |
| Quản trị | `/api/admin` | Dashboard, người dùng, bài đăng và báo cáo. |

Đăng ký và đăng nhập không yêu cầu JWT. Các nhóm chức năng còn lại yêu cầu header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Mở Swagger để xem HTTP method, request và response cụ thể. Tin nhắn mới được gửi qua phương thức SignalR `SendMessage(conversationId, content)` tại `/hubs/chat`; client nhận sự kiện `ReceiveMessage`.

## Lệnh phát triển

**Backend — chạy tại thư mục gốc:**

```bash
dotnet build CampusEcomSystemMini.slnx
dotnet watch --project CampusEcomSystemMini.Api run --launch-profile https
```

**Frontend — chạy trong `CampusEcomSystemMini.Web`:**

| Lệnh | Công dụng |
| --- | --- |
| `npm run dev` | Chạy Vite trong chế độ phát triển. |
| `npm run build` | Tạo bản build frontend trong `dist/`. |
| `npm run preview` | Xem thử bản build frontend trên máy. |
| `npm run lint` | Kiểm tra mã nguồn bằng ESLint. |

## Xử lý lỗi thường gặp

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| Backend/frontend báo lỗi cú pháp | Xử lý các vị trí đã liệt kê trong [Trạng thái mã nguồn](#trạng-thái-mã-nguồn), sau đó build lại. |
| Không hỗ trợ `net10.0` | Kiểm tra máy đã cài .NET SDK 10 bằng `dotnet --list-sdks`. |
| `dotnet ef` không tìm thấy project hoặc DbContext | Chạy từ thư mục gốc và truyền đủ `--project CampusEcomSystemMini.Infrastructure --startup-project CampusEcomSystemMini.Api`. |
| Không kết nối được SQL Server | Kiểm tra dịch vụ SQL Server, tên instance, thông tin đăng nhập và `ConnectionStrings:DefaultConnection`. |
| Trình duyệt báo lỗi chứng chỉ | Tin cậy chứng chỉ HTTPS phát triển; kiểm tra có thể mở `https://localhost:7123/swagger`. |
| Frontend không gọi được API | Kiểm tra `VITE_API_BASE_URL`, API đang chạy và đã khởi động lại Vite sau khi sửa biến môi trường. |
| Lỗi CORS hoặc SignalR kết nối thất bại | Origin hiện được cho phép là `http://localhost:5173`. SignalR client mặc định gửi credentials, trong khi policy hiện chưa có `AllowCredentials()`; nếu lỗi liên quan credentials, cần bổ sung tùy chọn này vào policy dành cho origin trên, hoặc cấu hình client không gửi credentials nếu chỉ dùng JWT. |
| API trả `401` / `403` | Đăng nhập lại để lấy JWT còn hạn; endpoint quản trị yêu cầu vai trò `Admin`. |
| Lost & Found không hiển thị Google Maps | Kiểm tra `VITE_GOOGLE_MAPS_API_KEY` và cấu hình Maps JavaScript API cho khóa; khi chưa có khóa, xem danh sách tọa độ. |
| Không tải được tài liệu trả phí của người khác | Giao dịch điểm tải tài liệu chưa được tích hợp; xem giới hạn trong phần trạng thái. |

## Tài liệu và đóng góp

| Tài liệu | Nội dung |
| --- | --- |
| [`Docs/AI_GUIDE.md`](Docs/AI_GUIDE.md) | Quy tắc kiến trúc, tổ chức mã nguồn và phát triển. |
| [`Docs/MODULE_1.md`](Docs/MODULE_1.md) | Tài khoản, hồ sơ và nhu cầu cá nhân. |
| [`Docs/MODULE_2.md`](Docs/MODULE_2.md) | Smart Matching. |
| [`Docs/MODULE_3.md`](Docs/MODULE_3.md) | Campus Lost & Found. |
| [`Docs/MODULE_4.md`](Docs/MODULE_4.md) | Thư viện và trao đổi sách/tài liệu. |
| [`Docs/MODULE_5.md`](Docs/MODULE_5.md) | Kết nối, Messenger và thông báo. |
| [`Docs/MODULE_6.md`](Docs/MODULE_6.md) | Gamification, bảng xếp hạng và quản trị. |

Các tài liệu module mô tả yêu cầu thiết kế; đối chiếu mã nguồn và trạng thái triển khai khi sử dụng.

Khi đóng góp, đọc hướng dẫn phát triển và tài liệu module liên quan, tạo branch riêng, giữ đúng phân lớp và API hiện có, kiểm tra build/lint cho phần thay đổi rồi mở Pull Request mô tả nội dung và kết quả kiểm tra.

Repository hiện chưa có file `LICENSE`. Nếu muốn công bố điều kiện sử dụng và phân phối mã nguồn, chủ dự án cần bổ sung giấy phép phù hợp.
