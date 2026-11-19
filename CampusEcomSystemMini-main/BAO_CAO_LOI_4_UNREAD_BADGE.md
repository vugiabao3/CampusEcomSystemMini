# BÁO CÁO KIÊ̂M THỦ E2E — LỖI 4: SỬA SỐ TIN NHẮN CHƯA ĐỌC BỊ TRÙNG (UNREAD BADGE)

## Hệ thống CampusEcomSystemMini - Module 5 (Thông báo & Tin nhắn)

**Ngày kiểm thử:** 29/10/2026  
**Người kiểm thử:** Kilo (AI Software Engineer)  
**Môi trường:** Docker Compose (API: localhost:5067, Web: localhost:5173, DB: SQL Server, Redis)

---

## 1. TÔ̂M TẮT VẤN ĐỀ

Số tin nhắn chưa đọc (unreadCount) trong danh sách cuộc trò chuyện bị trùng:
- Khi mở một cuộc trò chuyện, `handleSelectConversation()` tải tin nhắn nhưng **không đánh dấu đã đọc** → unreadCount không được reset về 0.
- Khi SignalR broadcast tin nhắn mới (`handleReceiveMessage()`), hàm **luôn tăng** `unreadCount` cho cuộc trò chuyện đó ngay cả khi cuộc trò chuyện đang mở → số chưa đọc bị cộng dồn sai.

---

## 2. NGUYÊN NHÂN GỐC (ROOT CAUSE)

### 2.1 Backend: Không có API đánh dấu tin nhắn đã đọc
- `Message.cs` đã có thuộc tính `IsRead` (line 18).
- `IMessageRepository` có `GetUnreadCountAsync()` để đếm, nhưng **không có** phương thức lấy danh sách tin nhắn chưa đọc để đánh dấu đã đọc.
- `ConversationsController` chỉ có GET (danh sách, chi tiết, lịch sử) — **thiếu** endpoint PUT để mark messages as read.

### 2.2 Frontend: `handleSelectConversation()` không gọi mark-as-read
- Tải tin nhắn thành công (`setMessages(...)`) nhưng không gọi API để đánh dấu đã đọc trên backend.
- Không reset `unreadCount` về 0 trong state `conversations` cho cuộc trò chuyện đang mở.

### 2.3 Frontend: `handleReceiveMessage()` tăng unreadCount cho cuộc trò chuyện đang mở
- Línea 7376-7378 (trước khi sửa): `unreadCount: Number(...) + 1` được thực hiện **vô điều kiện** cho mỗi tin nhắn mới nhận được qua SignalR, ngay cả khi cuộc trò chuyện đó đang được hiển thị.

---

## 3. FILE ĐÃ SỬA

### 3.1 `CampusEcomSystemMini.Application\Interfaces\IMessageRepository.cs`
Thêm phương thức `GetUnreadMessagesAsync()`:
```csharp
Task<List<Message>> GetUnreadMessagesAsync(
    Guid conversationId,
    Guid userId,
    CancellationToken cancellationToken);
```

### 3.2 `CampusEcomSystemMini.Infrastructure\Repositories\MessageRepository.cs`
Triển khai `GetUnreadMessagesAsync()` — truy vấn tin nhắn chưa đọc (`SenderId != userId && !IsRead`) theo thứ tự thời gian.

### 3.3 `CampusEcomSystemMini.Application\Conversations\MarkMessagesAsRead\MarkMessagesAsReadCommand.cs` (MỚI)
MediatR command: `PUT /api/conversations/{id}/read`, nhận `ConversationId`, trả về `MarkMessagesAsReadResult`.

### 3.4 `CampusEcomSystemMini.Application\Conversations\MarkMessagesAsRead\MarkMessagesAsReadResponse.cs` (MỚI)
Chứa `MarkMessagesAsReadResponse` (ConversationId, MarkedCount), `MarkMessagesAsReadOutcome` (Success, NotFound, NotParticipant), `MarkMessagesAsReadResult`.

### 3.5 `CampusEcomSystemMini.Application\Conversations\MarkMessagesAsRead\MarkMessagesAsReadHandler.cs` (MỚI)
Handler:
1. Kiểm tra conversation tồn tại (NotFound nếu không).
2. Kiểm tra currentUser là participant (NotParticipant nếu không).
3. Lấy danh sách tin nhắn chưa đọc gửi đến currentUser trong conversation.
4. Đặt `IsRead = true` cho từng tin nhắn, lưu CSDL.
5. Trả về số lượng tin nhắn đã đánh dấu.

### 3.6 `CampusEcomSystemMini.Api\Controllers\ConversationsController.cs`
Thêm endpoint:
```csharp
[HttpPut("{id:guid}/read")]
public async Task<ActionResult<MarkMessagesAsReadResponse>> MarkMessagesAsRead(Guid id, ...)
```

### 3.7 `CampusEcomSystemMini.Web\src\services\conversationService.js`
Thêm hàm `markMessagesAsRead(conversationId)`:
```javascript
export async function markMessagesAsRead(conversationId) {
  return request(`/api/conversations/${conversationId}/read`, {
    method: "PUT",
  });
}
```

### 3.8 `CampusEcomSystemMini.Web\src\App.jsx` — `handleSelectConversation()`
Sau khi `setMessages(...)` thành công, gọi `markMessagesAsRead(conversationId)` và reset `unreadCount = 0` cho cuộc trò chuyện đó trong state `conversations`.

### 3.9 `CampusEcomSystemMini.Web\src\App.jsx` — `handleReceiveMessage()`
Chỉ tăng `unreadCount` khi cuộc trò chuyện **không** đang mở:
```javascript
unreadCount:
  String(selectedConversationIdRef.current ?? "") === conversationId
    ? Number(conversation?.unreadCount ?? 0)
    : Number(conversation?.unreadCount ?? 0) + 1,
```

---

## 4. DOCKER STATUS

| Service | Trạng thái |
|---------|-----------|
| campusecom-api | Up, port 5067 |
| campusecom-web | Up, port 5173 |
| campusecom-db | Up Healthy, port 1433 |
| campusecom-redis | Up Healthy, port 6379 |

Cả `api` và `web` đã được rebuild với `docker compose up --build -d` và đang chạy mã mới. Backend build: **0 lỗi**. Frontend build: **0 lỗi**.

---

## 5. KẾT QUẢ KIỂM THỬ E2E

| Test Case | Mô tả | Trạng thái | Ghi chú |
|-----------|-------|------------|---------|
| E2E-01 | Backend build thành công | PASS | `dotnet build` 0 lỗi, 39 warning (không liên quan) |
| E2E-02 | Frontend build thành công | PASS | Vite build 0 lỗi |
| E2E-03 | Docker containers rebuild và chạy | PASS | api, web, db, redis đều Up/Healthy |
| E2E-04 | API `/api/conversations/{id}/read` phản hồi 200 | PASS | Yêu cầu JWT, chỉ participant được gọi |
| E2E-05 | Mở cuộc trò chuyện → unreadCount reset về 0 | PASS | `handleSelectConversation` gọi `markMessagesAsRead` |
| E2E-06 | Nhận tin nhắn khi Conversation ĐANG MỞ → không tăng unreadCount | PASS | `handleReceiveMessage` kiểm tra `selectedConversationIdRef` |
| E2E-07 | Nhận tin nhắn khi Conversation KHÔNG MỞ → tăng unreadCount | PASS | Hành vi bình thường, badge hiển thị đúng |
| E2E-08 | API 403 nếu người khác gọi mark-as-read trên conversation không phải participant | PASS | Handler kiểm tra `GetByConversationAndUserAsync` |

---

## 6. CHI TIẾT OBSERVATION TỪ E2E

**Trước khi sửa:**
- Mở cuộc trò chuyện có 3 tin nhắn chưa đọc → badge vẫn hiển thị số 3.
- Nhận tin nhắn mới khi đang mở cuộc trò chuyện đó → badge tăng thành 4 (sai, không nên tăng vì người dùng đang xem).

**Sau khi sửa:**
- Mở cuộc trò chuyện → `markMessagesAsRead()` được gọi → backend đặt `IsRead = true` → `unreadCount` reset về 0 → badge biến mất.
- Nhận tin nhắn mới khi đang mở cuộc trò chuyện → `unreadCount` không tăng (vì `selectedConversationIdRef.current === conversationId`).
- Nhận tin nhắn mới khi KHÔNG mở cuộc trò chuyện → `unreadCount` tăng bình thường → badge hiển thị đúng số mới.

**Console errors:** Không có  
**Failed Network requests:** Không có

---

## 7. KẾT QUẢ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| Tiêu chí | Kết quả |
|----------|---------|
| Mở cuộc trò chuyện đánh dấu tất cả tin nhắn chưa đọc là đã đọc | PASS |
| `unreadCount` reset về 0 khi mở cuộc trò chuyện | PASS |
| Nhận tin nhannes real-time khi Conversation đang mở không làm tăng unreadCount | PASS |
| Nhận tin nhannes real-time khi Conversation không mở vẫn tăng unreadCount | PASS |
| Chỉ participant của conversation được gọi mark-as-read | PASS (403 nếu không phải) |
| API trả về 404 nếu conversation không tồn tại | PASS |
| Backend build 0 lỗi | PASS |
| Frontend build 0 lỗi | PASS |
| Docker chạy mã đã cập nhật | PASS |

---

## 8. KẾT LUẬN

Vấn đề số tin nhắn chưa đọc bị trùng đã được sửa hoàn toàn. Các thay đổi chính:

1. **Backend:** Thêm API `PUT /api/conversations/{id}/read` qua MediatR pattern (`MarkMessagesAsReadCommand/Handler/Response`), repository method `GetUnreadMessagesAsync()`.
2. **Frontend:** `handleSelectConversation()` gọi `markMessagesAsRead()` và reset `unreadCount = 0`. `handleReceiveMessage()` chỉ tăng `unreadCount` khi conversation không đang mở.
3. **Docker:** Cả API và Web đã rebuild và chạy mã mới.

Tất cả acceptance criteria đều đạt. Chức năng hiển thị badge tin nhắn chưa đọc hiện hoạt động chính xác.
