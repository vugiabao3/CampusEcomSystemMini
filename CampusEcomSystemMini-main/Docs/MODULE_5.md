# MODULE 5 — MINI MESSENGER & NOTIFICATION

## 1. MỤC TIÊU

Module 5 gồm:

* Connection Request.
* Conversation + Message History.
* Chat 1-1 realtime bằng SignalR.
* Notification + Notification Bell.
* Nhận kết quả từ Module 2, 3, 4 để tạo notification.

**Tech:** C# .NET Core + React/Vite + SQL Server + JWT + SignalR.
**Architecture:** Clean Architecture + MediatR.

Reference:

* UI: https://vugiabao3.github.io/Interface_CampusEcomSystemMini-/GIAO_DIEN_MODULE_1,2,3,4,5,6.HTML
* Workflow: https://vugiabao3.github.io/Diagram-_-Work_Flow-/module5_ChatRealTime_ChuongThongBao.html
* Architecture: https://vugiabao3.github.io/Diagram-_-Work_Flow-/THUYET_TRINH_SHOW.html

**AI phải đọc code hiện tại trước khi code. Module 1 là Golden Reference.**

---

## 2. ARCHITECTURE

Giữ nguyên flow:

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

Không tạo architecture riêng.

Auth đã có:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

API cần đăng nhập dùng:

```text
ICurrentUserService.UserId
```

Không nhận `senderId/userId` từ client để xác định người gửi.

---

# 3. CONNECTION REQUEST — 4 API

### POST `/api/connections/requests`

Input:

```text
ReceiverId
```

Sender lấy từ `ICurrentUserService.UserId`.

Rules:

* Không self-request.
* Không duplicate Pending.
* Không giả mạo SenderId.
* Receiver phải tồn tại.

Flow:

```text
A → Request → B
       ↓
    Pending
       ↓
 Notification B
```

### GET `/api/connections/requests`

Lấy request của current user.

Frontend phân biệt:

```text
Received
Sent
```

Status:

```text
Pending
Accepted
Rejected
```

### PUT `/api/connections/requests/{id}/accept`

Chỉ Receiver được accept.

```text
Pending → Accepted / Matched
                  ↓
             Conversation
                  ↓
             Notification
```

### PUT `/api/connections/requests/{id}/reject`

Chỉ Receiver được reject.

```text
Pending → Rejected
             ↓
       Notification Sender
```

Role hệ thống chỉ:

```text
User
Admin
```

---

# 4. CONVERSATION — 2 API

### GET `/api/conversations`

Lấy conversation của current user.

Response có thể gồm:

```text
ConversationId
OtherUser
LastMessage
LastMessageAt
UnreadCount
```

### GET `/api/conversations/{id}`

Chỉ participant được xem.

Nếu không phải participant:

```text
403 Forbidden
```

Chat hiện tại chỉ **1-1**, không group chat.

---

# 5. MESSAGE HISTORY — 1 API

### GET `/api/conversations/{conversationId}/messages`

Response:

```text
MessageId
SenderId
SenderName
Content
SentAt
```

Có thể hỗ trợ:

```text
?page=1&pageSize=30
```

Pagination không bắt buộc ở batch đầu.

Chỉ participant được xem message.

---

# 6. SIGNALR REALTIME CHAT

Hub:

```text
/hubs/chat
```

Flow:

```text
Client A
 ↓
ChatHub
 ↓
JWT Authentication
 ↓
Check Conversation
 ↓
Save Message
 ↓
Broadcast
 ↓
Client B
```

Message phải được lưu DB trước/đồng bộ với broadcast phù hợp.

Nếu B offline:

```text
Message → DB
             ↓
      B mở app → History
```

Không làm mất message khi offline.

Hub:

```text
CampusEcomSystemMini.Api
└── Hubs
    └── ChatHub.cs
```

Hub chỉ xử lý realtime transport; business logic ưu tiên đặt ở Application/service.

### SignalR Authentication

Identity lấy từ:

```text
Context.User
```

Không trust `senderId/userId` từ client.

Frontend:

```text
Login
 ↓
JWT
 ↓
HubConnection
 ↓
/hubs/chat
 ↓
ReceiveMessage
 ↓
Update React state
```

Logout:

```text
Stop HubConnection
 ↓
Clear token
```

---

# 7. NOTIFICATION — 4 API

### GET `/api/notifications`

Response:

```text
Id
Type
Title
Message
IsRead
CreatedAt
RelatedId
```

### GET `/api/notifications/unread`

Dùng cho Notification Bell/unread count.

### PUT `/api/notifications/{id}/read`

Chỉ owner được mark read.

### PUT `/api/notifications/read-all`

Chỉ mark notification của current user.

---

# 8. NOTIFICATION SOURCES

Module 5 **không tự tính matching**. Chỉ nhận kết quả từ module khác.

### Module 2

Nếu:

```text
Study Match >= 80%
Room Match >= 80%
```

→ tạo notification.

### Module 3

Nếu Lost & Found matching:

```text
Distance <= 500m
```

→ tạo notification.

Module 3 chịu trách nhiệm Haversine/matching.

### Module 4

Nếu Book Exchange tìm được graph loop:

```text
A → B → C → A
```

→ tạo notification.

### Connection

Notification cho:

```text
New Request
Accepted
Rejected
```

Flow:

```text
Business Module
 ↓
Event / Integration
 ↓
Notification Service
 ↓
Save DB
 ↓
SignalR nếu online
 ↓
Notification Bell
```

Nếu chưa có event infrastructure, prototype có thể dùng Application interface/service đơn giản.

**Không tự thêm Kafka/RabbitMQ chỉ cho Module 5.**

---

# 9. DOMAIN MODEL

Entities:

```text
ConnectionRequest
Conversation
ConversationParticipant
Message
Notification
```

### Message

```text
Id
ConversationId
SenderId
Content
SentAt
```

Có thể thêm `IsRead`.

### Notification

```text
Id
UserId
Type
Title
Message
RelatedId
IsRead
CreatedAt
```

Types:

```text
ConnectionRequest
ConnectionAccepted
ConnectionRejected
StudyMatch
RoomMatch
LostFoundMatch
BookExchangeMatch
```

Không lưu PasswordHash/JWT Secret trong các entity này.

---

# 10. DATABASE

Không tạo toàn bộ DB Module 5 một lần.

```text
Batch 1
→ ConnectionRequest

Batch 2
→ Conversation
→ ConversationParticipant
→ Message

Batch 3
→ Notification
```

Migration incremental.

Không xóa DB hiện tại.

Không phá User/Auth/Post của Module 1.

---

# 11. BACKEND STRUCTURE

```text
CampusEcomSystemMini.Api
├── Controllers
│   ├── ConnectionsController.cs
│   ├── ConversationsController.cs
│   └── NotificationsController.cs
└── Hubs
    └── ChatHub.cs

CampusEcomSystemMini.Application
├── Connections
│   ├── SendRequest
│   ├── GetRequests
│   ├── AcceptRequest
│   └── RejectRequest
├── Conversations
│   ├── GetConversations
│   └── GetConversation
├── Messages
│   └── GetMessages
└── Notifications
    ├── GetNotifications
    ├── GetUnread
    ├── MarkAsRead
    └── MarkAllAsRead

CampusEcomSystemMini.Domain
└── Entities
    ├── ConnectionRequest.cs
    ├── Conversation.cs
    ├── ConversationParticipant.cs
    ├── Message.cs
    └── Notification.cs

CampusEcomSystemMini.Infrastructure
├── Data
├── Repositories
└── Services
    ├── Chat
    └── Notification
```

REST use case ưu tiên:

```text
Command/Query
Handler
Response
```

theo Module 1.

---

# 12. FRONTEND STRUCTURE

```text
src/
├── components/
│   └── messenger/
│       ├── MessengerPage.jsx
│       ├── ConversationList.jsx
│       ├── ChatWindow.jsx
│       ├── MessageList.jsx
│       ├── MessageInput.jsx
│       ├── ConnectionRequests.jsx
│       └── NotificationBell.jsx
├── services/
│   ├── connectionService.js
│   ├── conversationService.js
│   └── notificationService.js
├── hubs/
│   └── chatHub.js
└── styles/
    └── messenger.css
```

Reuse `authService.js` và JWT/token hiện tại.

Messenger:

```text
Conversation List
 ↓
Select Conversation
 ↓
Load History
 ↓
SignalR
 ↓
Send / Receive realtime
```

Connection UI:

```text
[Kết nối]
[Đồng ý] [Từ chối]
```

Notification Bell:

```text
🔔 Unread Count
      ↓
Notification List
```

---

# 13. SECURITY

* Sender lấy từ JWT/`ICurrentUserService`.
* Không self-request.
* Chỉ participant được xem conversation/message.
* Chỉ participant được gửi message.
* Chỉ owner được xem/read notification.
* SignalR dùng JWT.
* Không trust UserId gửi từ client.
* Không expose PasswordHash/JWT Secret.

---

# 14. MODULE BOUNDARY

### Module 5 chịu trách nhiệm

```text
Connection Request
Conversation
Message History
SignalR Chat
Notification
```

### Không chịu trách nhiệm

```text
Module 2 → Matching Score
Module 3 → Haversine / LostFound Matching
Module 4 → Book Exchange Graph Matching
Module 6 → Reward / Leaderboard / Admin
```

Chỉ nhận kết quả để tạo notification.

---

# 15. BATCH IMPLEMENTATION

## Batch 1 — Connection

**BE:**

```text
POST /api/connections/requests
GET  /api/connections/requests
PUT  /api/connections/requests/{id}/accept
PUT  /api/connections/requests/{id}/reject
```

DB:

```text
ConnectionRequest
```

**FE:**

```text
ConnectionRequests.jsx
```

Nút Kết nối / Đồng ý / Từ chối.

---

## Batch 2 — Conversation + History

**BE:**

```text
GET /api/conversations
GET /api/conversations/{id}
GET /api/conversations/{conversationId}/messages
```

DB:

```text
Conversation
ConversationParticipant
Message
```

**FE:**

```text
MessengerPage
ConversationList
ChatWindow
MessageList
MessageInput
```

---

## Batch 3 — SignalR

**BE:**

```text
/hubs/chat
```

Implement:

```text
SendMessage
ReceiveMessage
```

Flow:

```text
Send → Validate JWT → Check Conversation
     → Save DB → Broadcast → Receive
```

**FE:**

```text
chatHub.js
```

Connect/disconnect SignalR theo login/logout.

---

## Batch 4 — Notification

**BE:**

```text
GET /api/notifications
GET /api/notifications/unread
PUT /api/notifications/{id}/read
PUT /api/notifications/read-all
```

DB:

```text
Notification
```

**FE:**

```text
NotificationBell
NotificationList
UnreadCount
```

---

## Batch 5 — Integration

Chỉ làm khi Module 2/3/4 đã có kết quả:

```text
Study Match >= 80%
Room Match >= 80%
Lost & Found <= 500m
Book Exchange Match
Connection Request
Connection Accepted
Connection Rejected
```

Không duplicate thuật toán module khác.

---

# 16. TASK SCOPE

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

Không tự refactor Module 1/2/3/4.

---

# 17. BUILD RULE

Sau mỗi batch:

```text
dotnet build
npm run build
```

Nếu FAIL → sửa batch hiện tại trước.

Không tiếp tục batch sau khi batch hiện tại chưa PASS.

AI báo:

```text
Implemented:
Changed files:
API:
SignalR:
Database:
Frontend:
Build:
  Backend: PASS/FAIL
  Frontend: PASS/FAIL
Not implemented:
```

---

# 18. DEFINITION OF DONE

* 11 REST API đúng route.
* Connection Request hoạt động.
* Accept/Reject đúng quyền.
* Conversation + Message History hoạt động.
* SignalR `/hubs/chat` hoạt động.
* Chat 1-1 realtime.
* Message lưu DB và offline vẫn xem history.
* Notification APIs + unread count hoạt động.
* JWT/CurrentUserService đúng.
* Participant authorization đúng.
* Frontend gọi đúng API + SignalR.
* Loading/Error/Empty state cơ bản.
* Backend build PASS.
* Frontend build PASS.
* Không phá Module 1/2/3/4.
* Không lan sang Module 6.
