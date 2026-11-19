# MODULE 6 — GAMIFICATION & ADMIN HUB

## 1. MỤC TIÊU

Module 6 gồm:

* Gamification: điểm + lịch sử điểm.
* Leaderboard: bảng xếp hạng.
* Report: báo cáo bài đăng.
* Admin Dashboard.
* Admin Users / Posts / Reports.

**Tech:** C# .NET Core + React/Vite + SQL Server + JWT
**Architecture:** Clean Architecture + MediatR.

**Reference:**

* UI: https://vugiabao3.github.io/Interface_CampusEcomSystemMini-/GIAO_DIEN_MODULE_1,2,3,4,5,6.HTML
* Workflow: https://vugiabao3.github.io/Diagram-_-Work_Flow-/module6_TichDiem_BangXepHang.html
* Architecture: https://vugiabao3.github.io/Diagram-_-Work_Flow-/THUYET_TRINH_SHOW.html

**AI phải đọc code hiện tại trước khi code. Module 1 là Golden Reference.**

---

# 2. ARCHITECTURE & AUTH

Giữ nguyên flow Module 1:

```text
HTTP
 ↓
Controller
 ↓
MediatR Command / Query
 ↓
Handler
 ↓
Application Interface
 ↓
Infrastructure
 ↓
EF Core
 ↓
SQL Server
```

Current user:

```text
ICurrentUserService.UserId
```

Admin API:

```csharp
[Authorize(Roles = "Admin")]
```

Roles chỉ:

```text
User
Admin
```

Không tạo architecture hoặc Role mới.

---

# 3. GAMIFICATION — 2 API

### GET `/api/gamification/me`

Lấy điểm hiện tại:

```text
UserId
ReputationPoints
```

FE hiển thị trong Profile.

### GET `/api/gamification/history`

Lịch sử điểm:

```text
Id
Type
Reason
Change
Balance
CreatedAt
Status
```

Ví dụ:

```text
+50  LostFound Returned
+20  Book Exchange
+10  5★ Review
-20  Spam
-50  Serious Violation
```

Điểm phải cập nhật qua **GamificationService/use case**, không sửa trực tiếp trong Controller.

Point values tập trung một nơi, không hard-code rải rác nhiều Handler.

Có thể hỗ trợ:

```text
Register → +100
LostFound Returned → +50
Book Exchange → +20
5★ Review → +10
Spam → -20
Serious Violation → -50
```

Nếu workflow thay đổi số điểm, chỉ sửa rule/config.

---

# 4. LEADERBOARD — 2 API

### GET `/api/leaderboard?period=month`

Hỗ trợ:

```text
month
year
```

Response:

```text
Rank
UserId
FullName
AvatarUrl
ReputationPoints
Badge
```

Sort:

```text
ReputationPoints DESC
```

### GET `/api/leaderboard/me`

Lấy ranking của current user:

```text
Rank
ReputationPoints
Period
Badge
```

Khi điểm thay đổi:

```text
Point Transaction
 ↓
Update ReputationPoints
 ↓
Leaderboard cập nhật
```

Có thể dùng query trực tiếp hoặc background job đơn giản; không cần infrastructure phức tạp.

---

# 5. REPORT — 2 API

### POST `/api/reports`

User báo cáo bài đăng.

Input:

```text
PostId
Reason
Description
```

Reporter lấy từ:

```text
ICurrentUserService.UserId
```

Không nhận `ReporterId` từ client.

Status ban đầu:

```text
Pending
```

### GET `/api/reports/me`

Chỉ lấy report của current user:

```text
Id
PostId
Reason
Description
Status
CreatedAt
```

Flow:

```text
User
 ↓
Report Post
 ↓
Pending
 ↓
Admin Review
```

---

# 6. ADMIN DASHBOARD — 1 API

### GET `/api/admin/dashboard`

Chỉ Admin.

Có thể trả:

```text
TotalUsers
ActiveUsers
TotalPosts
PendingReports
ResolvedReports
TotalPoints
```

FE hiển thị các card thống kê cơ bản.

---

# 7. ADMIN USERS — 3 API

### GET `/api/admin/users`

Danh sách User.

Có thể hỗ trợ:

```text
?page=1&pageSize=20
&search=
&status=
```

Response:

```text
Id
FullName
Email
Role
Status
CreatedAt
ReputationPoints
```

### GET `/api/admin/users/{id}`

Chi tiết User:

```text
Id
FullName
Email
Phone
AvatarUrl
Role
Status
ReputationPoints
CreatedAt
```

Không trả `PasswordHash` hoặc JWT.

### PUT `/api/admin/users/{id}/status`

Thay đổi:

```text
Active
Blocked
```

Không cho API này thay đổi Role.

---

# 8. ADMIN POSTS — 3 API

### GET `/api/admin/posts`

Admin xem tất cả Post.

Có thể filter:

```text
type
status
search
page
pageSize
```

Response:

```text
Id
UserId
AuthorName
Type
Title
Status
CreatedAt
```

### GET `/api/admin/posts/{id}`

Admin xem chi tiết Post.

### DELETE `/api/admin/posts/{id}`

Admin xóa/ẩn Post vi phạm.

Nếu xử lý từ Report được duyệt:

```text
Report Approved
 ↓
Hide/Delete Post
 ↓
Penalty chủ bài
```

Không xóa User/Auth data.

---

# 9. ADMIN REPORTS — 4 API

### GET `/api/admin/reports`

Report Queue:

```text
Pending
Approved
Rejected
```

### GET `/api/admin/reports/{id}`

Chi tiết:

```text
Report
Reporter
Reported User
Post
Reason
Description
Status
CreatedAt
```

### PUT `/api/admin/reports/{id}/approve`

Chỉ Admin:

```text
Pending
 ↓
Approved
 ↓
Xử lý Post
 ↓
Penalty nếu cần
```

Không xử lý lại report đã Approved/Rejected.

### PUT `/api/admin/reports/{id}/reject`

```text
Pending
 ↓
Rejected
```

Không trừ điểm khi Report bị Reject.

---

# 10. DOMAIN MODEL

Reuse:

```text
User
Post
```

Không tạo User/Post duplicate.

Nếu User chưa có:

```text
ReputationPoints
Status
```

thì bổ sung.

Entity mới:

```text
GamificationPointTransaction
Report
```

### GamificationPointTransaction

```text
Id
UserId
Change
Reason
Balance
CreatedAt
```

### Report

```text
Id
PostId
ReporterId
Reason
Description
Status
CreatedAt
ReviewedAt
ReviewedBy
```

Status:

```text
Pending
Approved
Rejected
```

Database tạo **incremental theo batch**, không tạo toàn bộ Module 6 ngay từ đầu.

Không xóa DB hiện tại.

---

# 11. BACKEND STRUCTURE

Theo style Module 1:

```text
CampusEcomSystemMini.Api
└── Controllers
    ├── GamificationController.cs
    ├── LeaderboardController.cs
    ├── ReportsController.cs
    └── AdminController.cs

CampusEcomSystemMini.Application
├── Gamification
│   ├── GetMyPoints
│   └── GetPointHistory
├── Leaderboard
│   ├── GetLeaderboard
│   └── GetMyRank
├── Reports
│   ├── CreateReport
│   └── GetMyReports
└── Admin
    ├── Dashboard
    ├── Users
    ├── Posts
    └── Reports

CampusEcomSystemMini.Domain
└── Entities
    ├── GamificationPointTransaction.cs
    └── Report.cs

CampusEcomSystemMini.Infrastructure
├── Data
├── Repositories
└── Services
    ├── GamificationService.cs
    └── LeaderboardService.cs
```

Mỗi REST use case ưu tiên:

```text
Command / Query
 ↓
Handler
 ↓
Response
```

giống Module 1.

---

# 12. FRONTEND STRUCTURE

```text
CampusEcomSystemMini.Web
└── src
    ├── components
    │   ├── gamification
    │   │   ├── MyPoints.jsx
    │   │   ├── PointHistory.jsx
    │   │   └── Leaderboard.jsx
    │   ├── reports
    │   │   ├── ReportForm.jsx
    │   │   └── MyReports.jsx
    │   └── admin
    │       ├── AdminDashboard.jsx
    │       ├── AdminUsers.jsx
    │       ├── AdminUserDetail.jsx
    │       ├── AdminPosts.jsx
    │       ├── AdminPostDetail.jsx
    │       ├── AdminReports.jsx
    │       └── AdminReportDetail.jsx
    │
    ├── services
    │   ├── gamificationService.js
    │   ├── leaderboardService.js
    │   ├── reportService.js
    │   └── adminService.js
    │
    └── styles
        └── gamification.css
```

Reuse `authService.js`, JWT và login state hiện tại.

---

# 13. FRONTEND FLOW

### Points

```text
Profile
 ↓
GET /api/gamification/me
 ↓
Display Points
```

### History

```text
Point History
 ↓
GET /api/gamification/history
```

### Leaderboard

```text
Leaderboard
 ↓
GET /api/leaderboard?period=month
 ↓
Rank / User / Points / Badge
```

UI có:

```text
Tháng | Năm
```

### Report

```text
Post
 ↓
[Báo cáo]
 ↓
POST /api/reports
```

User xem:

```text
GET /api/reports/me
```

### Admin

```text
Admin Hub
 ├── Dashboard
 ├── Users
 ├── Posts
 └── Reports
```

Frontend có thể kiểm tra Role để hiển thị Admin UI, nhưng **backend vẫn bắt buộc `[Authorize(Roles = "Admin")]`**.

---

# 14. MODULE INTEGRATION

Module 6 nhận kết quả/event từ các module khác:

```text
Module 1
→ Register → Point

Module 3
→ LostFound Returned → Point

Module 4
→ Book Exchange Completed → Point
→ 5★ Review → Point

Module 5
→ Spam / Rate Limit → Penalty
```

Report:

```text
Post
 ↓
User Report
 ↓
Admin Review
 ↓
Approve / Reject
 ↓
Penalty nếu vi phạm
```

Module 6 **không duplicate**:

```text
Module 2 → Matching
Module 3 → Haversine / LostFound Matching
Module 4 → Book Matching
Module 5 → SignalR / Chat
```

---

# 15. BATCH IMPLEMENTATION

## BATCH 1 — GAMIFICATION

**BE:**

```text
GET /api/gamification/me
GET /api/gamification/history
```

DB:

```text
GamificationPointTransaction
```

**FE:**

```text
MyPoints.jsx
PointHistory.jsx
```

---

## BATCH 2 — LEADERBOARD

**BE:**

```text
GET /api/leaderboard?period=month
GET /api/leaderboard/me
```

**FE:**

```text
Leaderboard.jsx
```

Hỗ trợ `month/year`.

---

## BATCH 3 — REPORT

**BE:**

```text
POST /api/reports
GET /api/reports/me
```

DB:

```text
Report
```

**FE:**

```text
ReportForm.jsx
MyReports.jsx
```

---

## BATCH 4 — ADMIN HUB

**BE:**

```text
GET /api/admin/dashboard

GET /api/admin/users
GET /api/admin/users/{id}
PUT /api/admin/users/{id}/status

GET /api/admin/posts
GET /api/admin/posts/{id}
DELETE /api/admin/posts/{id}

GET /api/admin/reports
GET /api/admin/reports/{id}
PUT /api/admin/reports/{id}/approve
PUT /api/admin/reports/{id}/reject
```

**FE:** Dashboard, Users, Posts, Reports.

Tất cả `/api/admin/*` phải yêu cầu Admin.

---

## BATCH 5 — INTEGRATION

Kết nối:

```text
Register
LostFound Returned
Book Exchange
Review
Spam / Rate Limit
Approved Report
```

Flow:

```text
Event
 ↓
GamificationService
 ↓
Update Points
 ↓
Point History
 ↓
Leaderboard
```

---

# 16. TASK SCOPE & BUILD RULE

AI chỉ implement **đúng batch được yêu cầu**.

```text
Batch 1 BE
→ chỉ BE Batch 1

Batch 1 FE
→ chỉ FE Batch 1

Batch 1 BE + FE
→ chỉ Batch 1
```

Không tự làm batch tiếp theo.
Không tự refactor Module 1–5.
Không tự tạo API ngoài danh sách.

Sau mỗi batch:

```text
dotnet build
npm run build
```

Nếu FAIL → sửa batch hiện tại trước.

AI báo:

```text
Implemented:
Changed files:
API:
Database:
Frontend:
Build:
  Backend: PASS/FAIL
  Frontend: PASS/FAIL
Not implemented:
```

---

# 17. DEFINITION OF DONE

* 17 REST API đúng route.
* Gamification + Point History hoạt động.
* Leaderboard month/year hoạt động.
* User Report hoạt động.
* Admin Dashboard hoạt động.
* Admin Users / Posts / Reports hoạt động.
* Approve/Reject Report đúng quyền.
* Point transaction được lưu DB.
* `ICurrentUserService` được sử dụng.
* Admin API có Role authorization.
* Không expose PasswordHash/JWT Secret.
* Frontend gọi đúng API.
* Profile/Leaderboard/Report/Admin UI hoạt động.
* Backend build PASS.
* Frontend build PASS.
* Không phá Module 1–5.
* Không triển khai chức năng ngoài Module 6.
