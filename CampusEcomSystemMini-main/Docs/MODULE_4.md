# MODULE 4 — ACADEMIC LIBRARY & BOOK EXCHANGE

## 1. Mục tiêu

Module 4 quản lý:

* Đổi sách giáo trình giữa sinh viên.
* Chia sẻ tài liệu số.
* Tài liệu miễn phí / có phí bằng điểm.
* Download tài liệu.
* Watermark tài liệu khi download.
* Đánh giá tài liệu.
* Gợi ý chuỗi đổi sách chéo.

Backend: C# .NET Core
Frontend: ReactJS
Database: SQL Server
Authentication: JWT
Architecture: Clean Architecture + MediatR

---

## 2. Reference

UI:
https://vugiabao3.github.io/Interface_CampusEcomSystemMini-/GIAO_DIEN_MODULE_1,2,3,4,5,6.HTML

Workflow:
https://vugiabao3.github.io/Diagram-_-Work_Flow-/module4_TaiLieuSach.html

Architecture + Core Algorithms:
https://vugiabao3.github.io/Diagram-_-Work_Flow-/THUYET_TRINH_SHOW.html

AI phải đọc các reference trên khi cần hiểu UI/workflow, nhưng code thực tế của project luôn là nguồn tham chiếu chính.

---

# 3. GOLDEN REFERENCE — MODULE 1

Module 4 phải code theo đúng style Backend/Frontend đã có ở Module 1.

Backend flow:

HTTP Request
→ Controller
→ MediatR Command/Query
→ Handler
→ Application Interface
→ Infrastructure
→ EF Core
→ SQL Server

Không tạo architecture mới.

Không tạo Repository/Service pattern khác với project hiện tại.

Không tự thêm framework/package nếu không cần.

---

# 4. AUTHENTICATION

Các API Module 4 yêu cầu đăng nhập:

JWT Bearer.

User hiện tại lấy từ:

ICurrentUserService.UserId

Không nhận userId từ client để xác định owner.

Nếu JWT không hợp lệ:

401 Unauthorized.

Các API `/me` phải lấy user từ JWT.

---

# 5. MODULE 4 API — 18 API

## A. BOOK EXCHANGE — 7 API

### 1. GET /api/library/books

Lấy danh sách bài đăng đổi sách.

Có thể hỗ trợ filter/search nếu cần cho UI.

Response tối thiểu:

* Id
* Owner/User
* BookName
* WantedBookName
* Condition
* Description
* Status
* CreatedAt

---

### 2. GET /api/library/books/{id}

Lấy chi tiết một bài đăng đổi sách.

Không trả dữ liệu nhạy cảm không cần thiết.

---

### 3. GET /api/library/books/me

Lấy các bài đăng đổi sách của user hiện tại.

UserId lấy từ ICurrentUserService.

---

### 4. POST /api/library/books

Tạo bài đăng đổi sách.

Input chính:

* BookName
* WantedBookName
* Condition
* Description

Owner lấy từ JWT.

Không cho client tự truyền OwnerId để ghi đè owner.

---

### 5. PUT /api/library/books/{id}

Sửa bài đăng đổi sách.

Chỉ owner của bài đăng được sửa.

Không cho User sửa bài của User khác.

---

### 6. DELETE /api/library/books/{id}

Xóa bài đăng đổi sách.

Chỉ owner được xóa.

---

### 7. GET /api/library/books/exchange-matches

Tìm các bài đăng có khả năng đổi sách phù hợp.

Mục tiêu:

A có sách X và cần Y
B có sách Y và cần X

Có thể mở rộng thành chuỗi:

A → B → C → A

Đây là Graph Matching / Loop Matching.

Không cần triển khai thuật toán phức tạp nếu task không yêu cầu.

Ưu tiên trước:

* tìm direct match;
* sau đó mới mở rộng cycle matching nếu còn thời gian.

---

# 6. DOCUMENTS — 6 API

## 8. GET /api/library/documents

Lấy danh sách tài liệu.

UI cần hỗ trợ các nhóm:

* Tất cả tài liệu
* Miễn phí
* Trả phí
* Theo môn học / khoa
* Rating nếu cần

Response tối thiểu:

* Id
* Title
* Subject
* Description
* Uploader
* Price
* FileType
* FileSize
* Rating
* ReviewCount
* CreatedAt

Không trả file gốc trong API list.

---

## 9. GET /api/library/documents/{id}

Lấy chi tiết tài liệu.

Có thể trả:

* thông tin tài liệu;
* uploader;
* price;
* rating;
* review count;
* metadata file.

Không trả trực tiếp file gốc nếu chưa qua download flow.

---

## 10. GET /api/library/documents/me

Lấy tài liệu do user hiện tại upload.

UserId lấy từ ICurrentUserService.

---

## 11. POST /api/library/documents

Upload / tạo tài liệu.

Input:

* Title
* Subject
* Description
* PricingType
* Price
* File

PricingType:

* Free
* Paid

File hợp lệ:

* PDF
* DOCX

Giới hạn file:

* tối đa 25MB.

Backend phải validate:

* extension;
* size;
* file rỗng;
* file không hợp lệ.

Không lưu file trực tiếp vào DB.

Có thể dùng local storage trong giai đoạn prototype nếu infrastructure cloud chưa được yêu cầu.

Nếu task yêu cầu Cloud Storage thì mới tích hợp storage service.

---

## 12. PUT /api/library/documents/{id}

Sửa metadata tài liệu.

Ví dụ:

* Title
* Subject
* Description
* Price

Chỉ uploader/owner được sửa.

Không tùy tiện thay đổi file gốc nếu workflow chưa yêu cầu.

---

## 13. DELETE /api/library/documents/{id}

Xóa tài liệu.

Chỉ owner được xóa.

Khi xóa phải xử lý metadata/file reference phù hợp.

Không xóa file của user khác.

---

# 7. DOWNLOAD — 1 API

## 14. GET /api/library/documents/{id}/download

Download tài liệu.

Flow:

Request
→ JWT
→ lấy Document
→ kiểm tra tồn tại
→ kiểm tra pricing
→ nếu Paid thì kiểm tra điểm
→ tạo transaction nếu cần
→ tạo watermark
→ thành công thì trả file.

### Free document

Không trừ điểm.

Vẫn chạy watermark nếu workflow yêu cầu.

### Paid document

Kiểm tra số dư trước.

Nếu không đủ:

400/409 tùy convention hiện tại.

Không được trừ điểm nếu watermark/download thất bại.

---

# 8. WATERMARK

Watermark là business rule quan trọng của Module 4.

Mục tiêu:

File download phải được đóng dấu người tải.

Thông tin có thể gồm:

* FullName
* Student/User identifier nếu project có
* Email
* Timestamp

Theo architecture mẫu, watermark có thể được xử lý bằng C# PDF engine.

Có thể dùng iText nếu package/license phù hợp với project.

Không tự thêm package lớn nếu chưa cần.

### Flow

Original PDF
→ Watermark Engine
→ Watermarked PDF
→ Download

Nếu watermark thất bại:

* Không commit giao dịch.
* Không trừ điểm.
* Trả lỗi.
* Giữ trạng thái tài khoản/tài liệu nhất quán.

---

# 9. TRANSACTION / ROLLBACK

Đối với tài liệu có phí:

Begin Transaction

→ kiểm tra số dư

→ Hold/Trừ điểm người mua

→ tạo watermark

→ thành công

→ cộng điểm cho uploader nếu business rule yêu cầu

→ Commit

Nếu watermark hoặc bước quan trọng thất bại:

Rollback.

Không được xảy ra:

* người mua bị trừ điểm nhưng không nhận file;
* uploader được cộng điểm khi download thất bại.

Nếu hệ thống điểm chưa được Module 6 triển khai, chỉ tạo abstraction/interface cần thiết khi task thực sự yêu cầu.

Không tự tạo toàn bộ Module 6.

---

# 10. REVIEWS — 4 API

## 15. POST /api/library/documents/{id}/reviews

Tạo review cho tài liệu.

Input:

* Rating: 1–5
* Comment

UserId lấy từ JWT.

Không nhận UserId từ client.

Có thể giới hạn mỗi user chỉ review một lần nếu business rule yêu cầu.

---

## 16. GET /api/library/documents/{id}/reviews

Lấy danh sách review của tài liệu.

Response:

* ReviewId
* User
* Rating
* Comment
* CreatedAt
* UpdatedAt

Không trả PasswordHash hoặc dữ liệu nhạy cảm.

---

## 17. PUT /api/library/reviews/{reviewId}

Sửa review.

Chỉ người tạo review được sửa.

---

## 18. DELETE /api/library/reviews/{reviewId}

Xóa review.

Chỉ người tạo review được xóa.

Admin moderation thuộc Module 6/admin scope, không tự thêm nếu task không yêu cầu.

---

# 11. DOMAIN MODEL

Có thể sử dụng các entity:

```text
Document
BookExchangePost
DocumentReview
```

Có thể thêm:

```text
DocumentDownload
```

nếu cần lưu lịch sử download.

Không duplicate User.

Dùng:

```text
User
```

từ Module 1.

Không duplicate Post của Module 1 nếu kiến trúc thực tế có thể reuse.

Book Exchange có thể là entity riêng vì có business fields:

* BookName
* WantedBookName
* Condition
* Description
* OwnerId
* Status

---

# 12. DATABASE RULE

Không tạo sẵn toàn bộ database Module 4 trước khi cần.

Implement theo từng batch.

Ví dụ Batch 1 cần BookExchange:

→ tạo entity BookExchangePost
→ DbSet
→ configuration nếu cần
→ migration
→ database update.

Batch Documents mới tạo Document.

Batch Reviews mới tạo Review.

Không xóa database hiện tại.

Không làm hỏng bảng User/Auth hiện tại.

---

# 13. BACKEND FOLDER STYLE

Theo style Module 1:

```text
CampusEcomSystemMini.Api
└── Controllers
    └── LibraryController.cs

CampusEcomSystemMini.Application
└── Library
    ├── Books
    │   ├── GetBooks
    │   ├── GetBookById
    │   ├── GetMyBooks
    │   ├── CreateBook
    │   ├── UpdateBook
    │   ├── DeleteBook
    │   └── GetExchangeMatches
    │
    ├── Documents
    │   ├── GetDocuments
    │   ├── GetDocumentById
    │   ├── GetMyDocuments
    │   ├── CreateDocument
    │   ├── UpdateDocument
    │   └── DeleteDocument
    │
    ├── Download
    │   └── DownloadDocument
    │
    └── Reviews
        ├── CreateReview
        ├── GetReviews
        ├── UpdateReview
        └── DeleteReview

CampusEcomSystemMini.Domain
└── Entities
    ├── BookExchangePost.cs
    ├── Document.cs
    └── DocumentReview.cs

CampusEcomSystemMini.Infrastructure
├── Data
│   └── AppDbContext.cs
├── Repositories
└── Services
    └── Document/
```

Mỗi use case ưu tiên:

```text
Command/Query
Handler
Response
```

theo Module 1.

---

# 14. FRONTEND

Frontend dùng ReactJS/Vite hiện tại.

Không tạo frontend framework mới.

Suggested structure:

```text
CampusEcomSystemMini.Web
└── src
    ├── components
    │   └── library
    │       ├── LibraryPage.jsx
    │       ├── BookExchangeList.jsx
    │       ├── BookExchangeForm.jsx
    │       ├── BookExchangeDetail.jsx
    │       ├── DocumentList.jsx
    │       ├── DocumentForm.jsx
    │       ├── DocumentDetail.jsx
    │       ├── DocumentDownload.jsx
    │       ├── ReviewList.jsx
    │       └── ReviewForm.jsx
    │
    ├── services
    │   └── libraryService.js
    │
    └── styles
        └── library.css
```

Có thể thay đổi tên file nếu project hiện tại đã có convention khác.

Ưu tiên reuse component/style hiện có.

---

# 15. FRONTEND UI FLOW

## Library Page

Có các khu vực:

```text
KHO TÀI LIỆU & SÁCH

[Tất cả thư viện]
[Sàn đổi sách]
[Tài liệu miễn phí]
[Tài liệu trả phí]
```

UI mẫu có các luồng:

```text
Đổi sách giáo trình
↓
Tên sách đang có
↓
Tên sách đang tìm
↓
Tình trạng
↓
Mô tả
↓
Đăng
```

và:

```text
Đăng tải tài liệu số
↓
Tên tài liệu
↓
Môn học / Khoa
↓
Miễn phí / Có phí
↓
Giá điểm
↓
Chọn PDF/DOCX
↓
Upload
```

---

# 16. DOCUMENT UI FLOW

Danh sách:

```text
Document Card

Title
Subject
Uploader
Free / Price
Rating
Download
```

Chi tiết:

```text
Document Detail
↓
Thông tin tài liệu
↓
Rating / Reviews
↓
Download
```

Download:

```text
Free
→ Download

Paid
→ Check balance
→ Confirm
→ Watermark
→ Download
```

Nếu lỗi:

```text
Không đủ điểm
hoặc
Watermark thất bại
→ Hiển thị error
→ Không download file lỗi
```

---

# 17. BOOK EXCHANGE UI FLOW

```text
Book Exchange
↓
Danh sách sách
↓
Chọn sách
↓
Xem:
- Sách đang có
- Sách đang tìm
- Tình trạng
- Người đăng
↓
Exchange Match
```

Create:

```text
Đăng đổi sách
↓
BookName
WantedBookName
Condition
Description
↓
POST /api/library/books
```

My books:

```text
Bài đăng của tôi
↓
GET /api/library/books/me
```

---

# 18. EXCHANGE MATCHING ALGORITHM

Mục tiêu:

Tìm chuỗi trao đổi sách.

Ví dụ:

```text
A có Giải tích
A cần Triết

B có Triết
B cần Đại số

C có Đại số
C cần Giải tích
```

Graph:

```text
A → B → C → A
```

Ưu tiên implementation:

### Level 1

Direct match:

```text
A cần X
B có X
```

### Level 2

Cycle:

```text
A → B → C → A
```

Không cần thuật toán graph quá phức tạp trong batch đầu.

API:

```text
GET /api/library/books/exchange-matches
```

trả về các match phù hợp.

---

# 19. DOCUMENT FILTER

Document list nên hỗ trợ:

```text
Subject
PricingType
Rating
Search
```

Ví dụ:

```text
GET /api/library/documents?subject=CSharp
GET /api/library/documents?pricing=Free
GET /api/library/documents?pricing=Paid
```

Nếu API contract ban đầu chưa yêu cầu query cụ thể thì AI có thể bổ sung query parameters đơn giản khi UI cần.

Không tạo endpoint mới chỉ để filter.

---

# 20. ERROR RULE

Các trường hợp chính:

```text
401
→ Chưa đăng nhập / JWT invalid

403
→ Không phải owner

404
→ Book/Document/Review không tồn tại

400
→ Input/File không hợp lệ

409
→ Conflict business rule

422
→ Validation nếu project convention sử dụng
```

Giữ cách xử lý lỗi nhất quán với Module 1.

---

# 21. FILE VALIDATION

Document upload:

```text
Allowed:
PDF
DOCX

Max:
25MB
```

Reject:

```text
File > 25MB
Empty file
Unsupported extension
Invalid/corrupted file
Password-protected/encrypted file nếu backend có khả năng kiểm tra
```

Không tin hoàn toàn vào extension do client gửi.

Backend phải tự validate.

---

# 22. SECURITY

Không expose:

```text
PasswordHash
JWT secret
Storage credentials
Private file path
```

Không commit:

```text
AWS key
Google/API secret
Storage secret
JWT production secret
```

Nếu có Cloud Storage:

Dùng configuration/environment variable.

Không hard-code secret.

---

# 23. MODULE BOUNDARY

Module 4 chịu trách nhiệm:

```text
Book Exchange
Documents
Download
Watermark
Reviews
Exchange Matching
```

Module 4 KHÔNG tự triển khai toàn bộ:

```text
Module 5:
SignalR
Chat
Notification

Module 6:
Leaderboard
RepPoints
Admin moderation

Module 1:
Authentication
User Profile

Module 2:
Smart Matching sinh viên/phòng trọ

Module 3:
Lost & Found
```

Nếu cần tích hợp điểm/notification/chat:

→ tạo interface/integration point tối thiểu khi task yêu cầu.

Không copy implementation của module khác.

---

# 24. BATCH IMPLEMENTATION

## BATCH 1 — BOOK EXCHANGE

### Backend

Implement:

```text
GET    /api/library/books
GET    /api/library/books/{id}
GET    /api/library/books/me
POST   /api/library/books
PUT    /api/library/books/{id}
DELETE /api/library/books/{id}
GET    /api/library/books/exchange-matches
```

DB:

```text
BookExchangePost
```

### Frontend

Implement:

```text
LibraryPage
BookExchangeList
BookExchangeForm
BookExchangeDetail
```

Service:

```text
libraryService.js
```

Build:

```text
dotnet build
npm run build
```

---

# BATCH 2 — DOCUMENT

### Backend

Implement:

```text
GET    /api/library/documents
GET    /api/library/documents/{id}
GET    /api/library/documents/me
POST   /api/library/documents
PUT    /api/library/documents/{id}
DELETE /api/library/documents/{id}
```

DB:

```text
Document
```

File validation:

```text
PDF/DOCX
≤ 25MB
```

### Frontend

Implement:

```text
DocumentList
DocumentForm
DocumentDetail
```

Upload:

```text
multipart/form-data
```

Build BE + FE.

---

# BATCH 3 — DOWNLOAD + WATERMARK

### Backend

Implement:

```text
GET /api/library/documents/{id}/download
```

Flow:

```text
JWT
↓
Document
↓
Pricing
↓
Balance
↓
Transaction
↓
Watermark
↓
Commit
↓
Download
```

Failure:

```text
Rollback
```

### Frontend

Implement:

```text
Download button
Price display
Balance/error message
Download state
```

Build BE + FE.

---

# BATCH 4 — REVIEWS

### Backend

Implement:

```text
POST   /api/library/documents/{id}/reviews
GET    /api/library/documents/{id}/reviews
PUT    /api/library/reviews/{reviewId}
DELETE /api/library/reviews/{reviewId}
```

DB:

```text
DocumentReview
```

### Frontend

Implement:

```text
ReviewList
ReviewForm
Rating 1–5
Comment
Edit/Delete own review
```

Build BE + FE.

---

# 25. TASK SCOPE RULE

AI chỉ implement đúng batch được yêu cầu.

Nếu yêu cầu:

```text
Batch 1 Backend
```

→ chỉ làm Backend Batch 1.

Nếu yêu cầu:

```text
Batch 1 Frontend
```

→ chỉ làm Frontend Batch 1.

Nếu yêu cầu:

```text
Batch 1 BE + FE
```

→ làm đúng Batch 1.

Không tự làm Batch 2/3/4.

Không tự sửa Module 1/2/3 nếu không liên quan.

Không refactor toàn project.

---

# 26. CODE STYLE RULE

AI phải đọc code hiện tại trước khi tạo file.

Ưu tiên copy pattern từ:

```text
Register
Login
Me
Logout
```

Ví dụ:

```text
CreateBookCommand
CreateBookHandler
CreateBookResponse
```

và:

```text
GetBooksQuery
GetBooksHandler
GetBooksResponse
```

Không nhồi business logic vào Controller.

Controller chỉ:

```text
Receive Request
→ _mediator.Send()
→ Return HTTP Response
```

---

# 27. CURRENT USER RULE

Owner/User hiện tại luôn lấy:

```text
ICurrentUserService.UserId
```

Không tin:

```text
userId
ownerId
uploaderId
```

từ request body để xác định quyền sở hữu.

---

# 28. BUILD RULE

Sau mỗi batch:

```text
dotnet build
```

Sau phần Frontend:

```text
npm run build
```

Nếu build fail:

→ sửa lỗi của batch hiện tại.

Không tiếp tục sang batch mới khi batch hiện tại chưa build được.

---

# 29. AI RESPONSE FORMAT

Sau mỗi task, AI trả:

```text
Implemented:
- ...

Changed files:
- ...

API:
- ...

Database:
- ...

Frontend:
- ...

Build:
- Backend: PASS/FAIL
- Frontend: PASS/FAIL

Not implemented:
- ...
```

---

# 30. DEFINITION OF DONE

Module 4 được xem là hoàn thành khi:

* [ ] 18 API đúng route.
* [ ] JWT hoạt động.
* [ ] Owner authorization đúng.
* [ ] Book CRUD hoạt động.
* [ ] Exchange matching hoạt động ở mức yêu cầu.
* [ ] Document CRUD hoạt động.
* [ ] File validation hoạt động.
* [ ] Download hoạt động.
* [ ] Watermark hoạt động khi task yêu cầu.
* [ ] Transaction rollback không làm mất điểm khi download/watermark thất bại.
* [ ] Review CRUD hoạt động.
* [ ] Frontend gọi đúng API.
* [ ] Loading/error/empty state cơ bản có xử lý.
* [ ] Backend build PASS.
* [ ] Frontend build PASS.
* [ ] Không phá Module 1/2/3.
* [ ] Không triển khai lan sang Module 5/6 ngoài integration cần thiết.




