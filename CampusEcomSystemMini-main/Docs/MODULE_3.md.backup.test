# MODULE 3 — CAMPUS LOST & FOUND

## 1. PURPOSE

Module 3 provides Campus Lost & Found for:

```text
1. Báo mất đồ
2. Báo nhặt được đồ
3. Hiển thị đồ thất lạc trên Campus Map
4. Xác minh quyền sở hữu bằng Secret Question
5. Người mất gửi Claim
6. Người nhặt duyệt / từ chối Claim
7. Đánh dấu đồ đã được trả
```

Module 3 must reuse the existing User and Post system from Module 1.

The core workflow is:

```text
User Login
    ↓
JWT Authentication
    ↓
Lost & Found
    ↓
Lost / Found Post
    ↓
Location Lat/Lng
    ↓
Campus Map
    ↓
Secret Question
    ↓
Claim
    ↓
Finder Approve / Reject
    ↓
Returned
    ↓
Close Ticket
```

Do not create a separate authentication system.

Do not create a separate User system.

Do not create an unrelated Post system if Module 1 already provides the required Post entity.

---

# 2. GOLDEN REFERENCE — EXISTING PROJECT

All Module 3 code must follow the existing Module 1 Authentication implementation and existing project architecture.

Existing backend:

```text
CampusEcomSystemMini
│
├── CampusEcomSystemMini.Api
│   ├── Controllers
│   │   └── AuthController.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── CampusEcomSystemMini.Application
│   ├── Auth
│   │   ├── Register
│   │   │   ├── RegisterCommand.cs
│   │   │   ├── RegisterHandler.cs
│   │   │   └── RegisterResponse.cs
│   │   │
│   │   ├── Login
│   │   │   ├── LoginCommand.cs
│   │   │   ├── LoginHandler.cs
│   │   │   └── LoginResponse.cs
│   │   │
│   │   └── Me
│   │       ├── MeQuery.cs
│   │       ├── MeHandler.cs
│   │       └── MeResponse.cs
│   │
│   ├── Logout
│   │   ├── LogoutCommand.cs
│   │   └── LogoutHandler.cs
│   │
│   ├── Interfaces
│   │   ├── IUserRepository.cs
│   │   ├── IPasswordHasher.cs
│   │   ├── IJwtTokenService.cs
│   │   └── ICurrentUserService.cs
│   │
│   └── DependencyInjection.cs
│
├── CampusEcomSystemMini.Domain
│   └── Entities
│       └── User.cs
│
└── CampusEcomSystemMini.Infrastructure
    ├── Data
    │   └── AppDbContext.cs
    ├── Repositories
    │   └── UserRepository.cs
    ├── Security
    │   ├── PasswordHasher.cs
    │   └── JwtTokenService.cs
    ├── Services
    │   └── CurrentUserService.cs
    └── DependencyInjection.cs
```

Existing frontend:

```text
CampusEcomSystemMini.Web
│
└── src
    ├── components
    │   ├── LoginForm.jsx
    │   ├── RegisterForm.jsx
    │   ├── HomePage.jsx
    │   └── UserProfile.jsx
    │
    ├── services
    │   └── authService.js
    │
    ├── styles
    │   └── auth.css
    │
    ├── App.jsx
    └── main.jsx
```

Follow the same architecture.

Do not create another architecture.

Do not replace MediatR.

Do not replace the existing JWT implementation.

Do not rewrite working Module 1 code.

Do not create a second User table.

Do not create a second authentication mechanism.

---

# 3. ARCHITECTURE

Backend:

```text
HTTP Request
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

Frontend:

```text
React Component
    ↓
Service
    ↓
HTTP API
    ↓
Backend
```

Controller responsibilities:

```text
Receive HTTP request
        ↓
Create MediatR Command / Query
        ↓
Send through MediatR
        ↓
Return HTTP response
```

Controller must NOT:

```text
Query DbContext directly
Calculate business logic
Calculate Haversine directly
Calculate TF-IDF directly
Validate ownership using database logic
Create Secret Question logic
Approve Claim directly
```

Handlers contain application/use-case orchestration.

Infrastructure contains:

```text
EF Core
DbContext
Repositories
External technical services
```

Domain contains core entities/enums/domain concepts.

Keep Domain independent from:

```text
ASP.NET Core
EF Core implementation details
JWT
HTTP
React
Infrastructure
```

---

# 4. MODULE 3 API CONTRACT

Module 3 currently contains exactly these APIs:

## Lost & Found Listing

```text
GET /api/lost-found?type=Lost

GET /api/lost-found?type=Found

GET /api/lost-found?status=Returned
```

These APIs are used for:

```text
Tất cả đồ thất lạc
Cần Tìm / Báo Mất
Nhặt Được / Chờ Chủ
Đã Trao Trả
```

---

## Map

```text
GET /api/lost-found/map
```

Used for the Campus Map.

---

## Secret Question — Finder

```text
POST /api/lost-found/{postId}/secret-question
```

The finder creates the secret question and answer.

---

## Secret Question — Lost User

```text
GET /api/lost-found/{postId}/secret-question
```

The person who lost the item can view the question.

The secret answer must NEVER be returned.

---

## Claim

```text
POST /api/lost-found/{postId}/claims
```

The person who lost the item submits an answer/claim.

---

## Finder Reviews Claims

```text
GET /api/lost-found/{postId}/claims
```

---

## Approve Claim

```text
PUT /api/lost-found/claims/{claimId}/approve
```

---

## Reject Claim

```text
PUT /api/lost-found/claims/{claimId}/reject
```

---

## Returned

```text
PUT /api/lost-found/{postId}/returned
```

---

# 5. API SCOPE RULE

The current Module 3 contract contains ONLY the APIs defined above.

Do not add additional endpoints unless explicitly requested.

Do not automatically create:

```text
POST /api/reports
GET /api/reports
POST /api/connections
GET /api/connections
POST /api/chat
GET /api/chat
SignalR Hub
Notification APIs
Reputation APIs
Leaderboard APIs
Admin moderation APIs
```

Those features may appear in the overall workflow, but they are outside the current Module 3 API contract.

---

# 6. AUTHENTICATION

All Module 3 APIs require authentication unless explicitly stated otherwise.

Use:

```text
[Authorize]
```

The existing JWT implementation is the source of authentication.

Current user must be obtained through:

```text
ICurrentUserService
        ↓
CurrentUserService
        ↓
JWT ClaimTypes.NameIdentifier
```

Do not require the frontend to send the current user's ID when the backend can obtain it from JWT.

Do not read JWT claims manually inside every Handler.

Reuse:

```text
ICurrentUserService
```

---

# 7. EXISTING POST SYSTEM

Module 3 is based on the Post system from Module 1.

Lost & Found posts should reuse the existing Post architecture.

Conceptually:

```text
Post
│
├── Type
│   ├── Lost
│   └── Found
│
├── Content / Description
├── Image
├── Location
├── Lat
├── Lng
└── Status
```

If Module 1 already has fields for these concepts, reuse them.

Do not create duplicate fields when an existing field can represent the same information.

If the existing Post model uses different property names, map the existing property to the Module 3 concept.

Do not blindly create a second LostFoundPost entity without inspecting the existing project first.

---

# 8. LOST & FOUND TYPES

The UI provides:

```text
Lost
Found
Returned
```

Meaning:

```text
Lost
→ Người dùng báo mất đồ.

Found
→ Người dùng nhặt được đồ và đang tìm chủ.

Returned
→ Đồ đã được xác nhận trao trả.
```

The exact persistence representation must follow the existing project's model.

Do not invent a second status system if one already exists.

---

# 9. LOST & FOUND LIST API

## API

```text
GET /api/lost-found?type=Lost
```

Purpose:

```text
Return Lost posts.
```

---

## API

```text
GET /api/lost-found?type=Found
```

Purpose:

```text
Return Found posts.
```

---

## API

```text
GET /api/lost-found?status=Returned
```

Purpose:

```text
Return posts that have been successfully returned.
```

The API should return only data required by the Lost & Found UI.

Conceptual response:

```json
[
  {
    "postId": "guid",
    "userId": "guid",
    "fullName": "Nguyen Van A",
    "type": "Lost",
    "title": "Ví da màu đen",
    "description": "Mất tại thư viện H2",
    "imageUrl": "...",
    "location": "H2",
    "lat": 20.999,
    "lng": 105.812,
    "status": "Lost"
  }
]
```

This is conceptual.

Use the actual existing Post fields when implementing.

Do not expose:

```text
PasswordHash
JWT
JWT Secret
Database Connection String
Secret Answer
Internal Security Data
```

Do not expose EF entities directly.

Use Response DTOs.

---

# 10. MAP API

## API

```text
GET /api/lost-found/map
```

Purpose:

```text
Provide Lost & Found data required by the Campus Map.
```

Flow:

```text
Authenticated User
        ↓
GET /api/lost-found/map
        ↓
Load relevant Lost & Found posts
        ↓
Read Lat / Lng
        ↓
Map Response DTO
        ↓
Frontend Campus Map
        ↓
Display Pins
```

The backend is responsible for providing valid coordinates.

The frontend is responsible for displaying the map and pins.

Do not calculate business matching logic inside React.

---

# 11. GOOGLE MAPS BOUNDARY

The workflow uses Google Maps JavaScript API.

Conceptually:

```text
Backend
    ↓
Lat / Lng
    ↓
Frontend
    ↓
Google Maps
    ↓
Campus Map Pins
```

The backend does NOT render the Google Map.

The frontend renders the map.

Do not put Google Maps business logic inside the Controller.

Do not expose private API keys in backend responses.

If a Google Maps API key is required by the frontend, use the project's frontend environment mechanism.

Never put secrets into source code.

---

# 12. LOCATION DATA

Lost & Found posts can contain:

```text
Location / Building
Lat
Lng
```

Example:

```text
Building:
H2

Lat:
20.999...

Lng:
105.812...
```

The system uses location for:

```text
Map display
Geographic matching
```

Do not use fake coordinates when real coordinates exist.

Do not generate random coordinates.

---

# 13. HAVERSINE ALGORITHM

The overall Module 3 architecture defines Haversine as the geographic distance algorithm.

Formula:

```text
d = 2R × arcsin(
    sqrt(
        sin²(Δlat / 2)
        +
        cos(lat1)
        × cos(lat2)
        × sin²(Δlng / 2)
    )
)
```

Use:

```text
R = 6371 km
```

The workflow defines:

```text
Distance <= 500m
    ↓
Same Lost Area
```

The calculation belongs to backend/application logic.

Do NOT calculate Haversine in React.

Do NOT duplicate the formula in multiple Handlers.

If the implementation requires a reusable service, create an application abstraction such as:

```text
IGeoDistanceService
```

or another name consistent with the existing project.

Do not create duplicate services.

---

# 14. TEXT MATCHING — TF-IDF

The overall Module 3 architecture also describes:

```text
Geo-distance + TF-IDF Text
```

for Lost & Found matching.

TF-IDF is used conceptually to compare textual information such as:

```text
Item name
Description
Location
Relevant item information
```

The matching flow is:

```text
Lost Post
    ↓
Extract Text Features

Found Post
    ↓
Extract Text Features

TF-IDF
    ↓
Text Similarity

Geo Distance
    ↓
Haversine

Combined Matching Logic
    ↓
Match Score
```

The backend is the source of truth.

The frontend must not calculate TF-IDF.

Do not replace TF-IDF with random scoring.

Do not hard-code MatchScore.

Do not invent a different matching algorithm unless explicitly requested.

If the current batch does not require exposing or returning a MatchScore, do not create a new API just to expose it.

---

# 15. MATCHING BOUNDARY

The workflow describes:

```text
Save Lost / Found
        ↓
Run Matching
        ↓
Geo-distance + TF-IDF
        ↓
Score >= 80%
        ↓
Notification
```

However, the current Module 3 API contract does NOT include a notification API.

Therefore:

```text
DO NOT implement:
SignalR Notification
Push Notification
Notification Database
Chat
Connection Request
```

as part of the current Lost & Found APIs unless explicitly requested.

The current implementation must focus on the defined APIs.

---

# 16. SECRET QUESTION SYSTEM

The Secret Question is the ownership verification mechanism.

Workflow:

```text
Finder
    ↓
Create Found Post
    ↓
Create Secret Question + Secret Answer
    ↓
Save securely
```

Example:

```text
Question:
"Móc khóa có hình con vật gì và màu gì?"

Answer:
"Con mèo màu xanh"
```

The answer is private.

The answer must NEVER be returned by:

```text
GET /api/lost-found/{postId}/secret-question
```

The person who lost the item should only receive:

```text
Question
```

not:

```text
Answer
```

---

# 17. CREATE SECRET QUESTION

## API

```text
POST /api/lost-found/{postId}/secret-question
```

Purpose:

```text
Finder creates verification question and answer.
```

Flow:

```text
Authenticated Finder
        ↓
Post ID
        ↓
Verify Post exists
        ↓
Verify Post Type = Found
        ↓
Verify Current User owns the Found Post
        ↓
Validate Question
        ↓
Validate Answer
        ↓
Save Secret Question
        ↓
Save Secret Answer securely
        ↓
Return safe response
```

Only the finder/owner of the Found post can create its secret question.

Do not allow another user to modify the question.

Do not return the answer in the response.

---

# 18. GET SECRET QUESTION

## API

```text
GET /api/lost-found/{postId}/secret-question
```

Purpose:

```text
The person who lost the item views the secret question.
```

Response conceptually:

```json
{
  "postId": "guid",
  "question": "Móc khóa có hình con vật gì?"
}
```

Never return:

```json
{
  "answer": "..."
}
```

The secret answer must remain hidden.

---

# 19. CLAIM SYSTEM

A Claim represents:

```text
Người mất đồ
    ↓
Yêu cầu nhận lại đồ
```

Flow:

```text
Lost User
    ↓
View Secret Question
    ↓
Submit Answer
    ↓
Create Claim
    ↓
Finder Reviews Claim
    ↓
Approve / Reject
```

---

# 20. CREATE CLAIM

## API

```text
POST /api/lost-found/{postId}/claims
```

Purpose:

```text
The person who lost the item submits a claim.
```

Flow:

```text
Authenticated User
        ↓
Post ID
        ↓
Verify Post exists
        ↓
Verify Post Type = Found
        ↓
Verify current user is not the Finder
        ↓
Load Secret Question
        ↓
Verify submitted answer
        ↓
Create Claim
        ↓
Save Claim
```

The answer submitted by the claimant must be compared against the stored secret answer.

Do not return the stored secret answer.

Do not expose the answer in API responses.

Do not log the secret answer.

---

# 21. CLAIM RESPONSE

Conceptual:

```json
{
  "claimId": "guid",
  "postId": "guid",
  "status": "Pending"
}
```

Use the project's existing naming conventions.

Do not expose:

```text
SecretAnswer
PasswordHash
JWT
Internal Security Data
```

---

# 22. GET CLAIMS

## API

```text
GET /api/lost-found/{postId}/claims
```

Purpose:

```text
Finder views claims submitted for their Found post.
```

Flow:

```text
Authenticated User
        ↓
Post ID
        ↓
Verify Post exists
        ↓
Verify Current User owns Found Post
        ↓
Load Claims
        ↓
Return Claim DTOs
```

Only the appropriate Finder should be allowed to review claims for that Found post.

Do not allow arbitrary users to read another user's claims.

---

# 23. APPROVE CLAIM

## API

```text
PUT /api/lost-found/claims/{claimId}/approve
```

Purpose:

```text
Finder approves a valid claim.
```

Flow:

```text
Finder
    ↓
Claim
    ↓
Verify Claim exists
    ↓
Load related Found Post
    ↓
Verify Current User owns Found Post
    ↓
Approve Claim
    ↓
Update Claim Status
```

Do not allow a random authenticated user to approve another user's claim.

The backend must validate ownership.

---

# 24. REJECT CLAIM

## API

```text
PUT /api/lost-found/claims/{claimId}/reject
```

Purpose:

```text
Finder rejects an invalid claim.
```

Flow:

```text
Finder
    ↓
Claim
    ↓
Verify Claim exists
    ↓
Load related Found Post
    ↓
Verify Current User owns Found Post
    ↓
Reject Claim
    ↓
Update Claim Status
```

Do not allow a random authenticated user to reject another user's claim.

---

# 25. CLAIM STATUS

The Claim system should conceptually support:

```text
Pending
Approved
Rejected
```

Use the existing project enum/status conventions if available.

Do not create duplicate status systems.

After a Claim is approved, the current Module 3 API contract does not require Chat or SignalR.

Do not automatically create Chat.

---

# 26. RETURNED

## API

```text
PUT /api/lost-found/{postId}/returned
```

Purpose:

```text
Finder confirms that the item has been returned.
```

Flow:

```text
Finder
    ↓
Post ID
    ↓
Verify Post exists
    ↓
Verify Current User owns Found Post
    ↓
Verify appropriate Claim is approved
    ↓
Update Post Status = Returned
    ↓
Save database changes
    ↓
Return result
```

The backend must perform ownership and state validation.

Do not allow an unrelated user to mark an item as Returned.

Do not simply trust a userId sent from the frontend.

Use:

```text
ICurrentUserService
```

---

# 27. RETURNED STATE

After successful return:

```text
Found
    ↓
Approved Claim
    ↓
Returned
```

The returned post should become visible through:

```text
GET /api/lost-found?status=Returned
```

The database state is the source of truth.

Frontend must not fake the Returned status.

---

# 28. DOMAIN / DATA MODEL

Before creating entities, inspect the existing Module 1 Post model.

Reuse existing entities when possible.

Module 3 may require concepts such as:

```text
Lost / Found Post
SecretQuestion
Claim
```

Possible conceptual structure:

```text
Post
│
├── Type
├── Status
├── Location
├── Lat
├── Lng
└── Owner

SecretQuestion
│
├── PostId
├── Question
└── SecretAnswer

Claim
│
├── Id
├── PostId
├── ClaimantUserId
└── Status
```

This is a conceptual model.

Do not blindly create these classes if the existing project already represents the same information.

Inspect:

```text
Domain
AppDbContext
Post model
User model
existing repositories
existing migrations
```

first.

---

# 29. BACKEND FOLDER STRUCTURE

Follow the existing Application pattern.

Suggested:

```text
CampusEcomSystemMini.Application
│
└── LostFound
    │
    ├── GetLostFound
    │   ├── GetLostFoundQuery.cs
    │   ├── GetLostFoundHandler.cs
    │   └── GetLostFoundResponse.cs
    │
    ├── GetMap
    │   ├── GetLostFoundMapQuery.cs
    │   ├── GetLostFoundMapHandler.cs
    │   └── GetLostFoundMapResponse.cs
    │
    ├── SecretQuestion
    │   ├── CreateSecretQuestion
    │   │   ├── CreateSecretQuestionCommand.cs
    │   │   ├── CreateSecretQuestionHandler.cs
    │   │   └── CreateSecretQuestionResponse.cs
    │   │
    │   └── GetSecretQuestion
    │       ├── GetSecretQuestionQuery.cs
    │       ├── GetSecretQuestionHandler.cs
    │       └── GetSecretQuestionResponse.cs
    │
    ├── Claims
    │   ├── CreateClaim
    │   │   ├── CreateClaimCommand.cs
    │   │   ├── CreateClaimHandler.cs
    │   │   └── CreateClaimResponse.cs
    │   │
    │   ├── GetClaims
    │   │   ├── GetClaimsQuery.cs
    │   │   ├── GetClaimsHandler.cs
    │   │   └── GetClaimsResponse.cs
    │   │
    │   ├── ApproveClaim
    │   │   ├── ApproveClaimCommand.cs
    │   │   └── ApproveClaimHandler.cs
    │   │
    │   └── RejectClaim
    │       ├── RejectClaimCommand.cs
    │       └── RejectClaimHandler.cs
    │
    └── Returned
        ├── MarkReturnedCommand.cs
        ├── MarkReturnedHandler.cs
        └── MarkReturnedResponse.cs
```

If the existing project uses a slightly different naming structure:

```text
Follow existing project structure.
```

Do not blindly create a different architecture.

---

# 30. REPOSITORY / INTERFACE

Before creating new repositories, inspect existing interfaces.

Reuse existing repositories where possible.

If a new repository abstraction is required, place it in:

```text
CampusEcomSystemMini.Application
└── Interfaces
```

Example:

```text
IPostRepository
ILostFoundRepository
IClaimRepository
ISecretQuestionRepository
```

Only create the minimum required interfaces.

Do not create duplicate repositories for the same database entity.

Infrastructure implements those interfaces.

---

# 31. MATCHING SERVICE

The Lost & Found matching logic must not be duplicated.

If required by the current implementation, create a reusable application abstraction such as:

```text
ILostFoundMatchingService
```

Responsibilities may include:

```text
Haversine distance
TF-IDF text similarity
Matching score
```

Handlers should orchestrate:

```text
Load data
    ↓
Validate data
    ↓
Call matching service
    ↓
Map response
```

Do not put matching formulas inside:

```text
Controller
React Component
Multiple Handlers
```

---

# 32. CONTROLLER

Create:

```text
CampusEcomSystemMini.Api
└── Controllers
    └── LostFoundController.cs
```

Controller exposes the Module 3 routes.

Conceptually:

```text
GET  /api/lost-found
GET  /api/lost-found/map

POST /api/lost-found/{postId}/secret-question
GET  /api/lost-found/{postId}/secret-question

POST /api/lost-found/{postId}/claims
GET  /api/lost-found/{postId}/claims

PUT  /api/lost-found/claims/{claimId}/approve
PUT  /api/lost-found/claims/{claimId}/reject

PUT  /api/lost-found/{postId}/returned
```

Controller responsibilities:

```text
HTTP
↓
MediatR
↓
Response
```

Nothing more.

---

# 33. FRONTEND STRUCTURE

Continue the existing React structure:

```text
CampusEcomSystemMini.Web
│
└── src
    ├── components
    ├── services
    ├── styles
    ├── App.jsx
    └── main.jsx
```

Suggested:

```text
components
│
└── lostFound
    ├── LostFoundPage.jsx
    ├── LostFoundFilter.jsx
    ├── LostFoundList.jsx
    ├── LostFoundCard.jsx
    ├── LostFoundMap.jsx
    ├── SecretQuestionForm.jsx
    ├── SecretQuestionView.jsx
    ├── ClaimForm.jsx
    └── ClaimList.jsx
```

Do not create duplicate components if an existing component can be reused.

---

# 34. FRONTEND SERVICE

Create:

```text
CampusEcomSystemMini.Web
└── src
    └── services
        └── lostFoundService.js
```

All Module 3 API calls belong here.

Conceptually:

```javascript
getLostPosts()

getFoundPosts()

getReturnedPosts()

getLostFoundMap()

createSecretQuestion(postId, data)

getSecretQuestion(postId)

createClaim(postId, data)

getClaims(postId)

approveClaim(claimId)

rejectClaim(claimId)

markReturned(postId)
```

Mapping:

```text
getLostPosts()
    ↓
GET /api/lost-found?type=Lost

getFoundPosts()
    ↓
GET /api/lost-found?type=Found

getReturnedPosts()
    ↓
GET /api/lost-found?status=Returned

getLostFoundMap()
    ↓
GET /api/lost-found/map

createSecretQuestion(postId)
    ↓
POST /api/lost-found/{postId}/secret-question

getSecretQuestion(postId)
    ↓
GET /api/lost-found/{postId}/secret-question

createClaim(postId)
    ↓
POST /api/lost-found/{postId}/claims

getClaims(postId)
    ↓
GET /api/lost-found/{postId}/claims

approveClaim(claimId)
    ↓
PUT /api/lost-found/claims/{claimId}/approve

rejectClaim(claimId)
    ↓
PUT /api/lost-found/claims/{claimId}/reject

markReturned(postId)
    ↓
PUT /api/lost-found/{postId}/returned
```

Reuse the existing authentication token mechanism from:

```text
authService.js
```

Do not duplicate token storage logic.

---

# 35. FRONTEND LOST & FOUND UI

The provided UI contains:

```text
CAMPUS LOST & FOUND
```

with:

```text
Tất cả đồ thất lạc
Cần Tìm (Báo Mất)
Nhặt Được (Chờ Chủ)
Đã Trao Trả
```

The UI should use the backend API.

Do not hard-code fake Lost & Found data.

---

# 36. LOST / FOUND FILTER

Frontend filter:

```text
Tất cả đồ thất lạc
    ↓
Load relevant Lost & Found data

Cần Tìm
    ↓
GET /api/lost-found?type=Lost

Nhặt Được
    ↓
GET /api/lost-found?type=Found

Đã Trao Trả
    ↓
GET /api/lost-found?status=Returned
```

Backend remains the source of truth.

Do not filter a huge dataset only in React if the API already supports the filter.

---

# 37. LOST & FOUND MAP UI

The UI should display:

```text
Campus Map
    ↓
Lost / Found Pins
```

Flow:

```text
User opens Lost & Found
        ↓
LostFoundPage
        ↓
lostFoundService.getLostFoundMap()
        ↓
GET /api/lost-found/map
        ↓
Backend returns map data
        ↓
LostFoundMap.jsx
        ↓
Google Maps
        ↓
Display pins
```

The frontend must not:

```text
Generate fake coordinates
Calculate Haversine
Calculate TF-IDF
Generate fake MatchScore
```

---

# 38. CREATE FOUND POST — UI BOUNDARY

The provided UI contains:

```text
Đăng Tin Campus Lost & Found
```

with:

```text
Loại Tin Lost & Found
Tên Đồ Vật / Tài Sản
Mô Tả Chi Tiết
Vị trí Campus / Tòa nhà
Hình Ảnh Vật Thể
Tạo Câu Hỏi Bí Mật
```

The actual Post creation API belongs to the existing Module 1 Post system if already implemented there.

Module 3 must NOT automatically create another:

```text
POST /api/lost-found
```

because that endpoint is not in the current Module 3 API contract.

If Module 1 already owns Post CRUD, reuse it.

---

# 39. IMAGE UPLOAD BOUNDARY

The workflow mentions:

```text
Cloudinary / S3
```

for image upload.

However, the current Module 3 API contract does not define an image-upload endpoint.

Therefore:

```text
Do not automatically create:
POST /api/upload
POST /api/lost-found/upload
```

unless explicitly requested.

If Module 1 already stores an image URL, Module 3 should reuse that field.

Do not introduce a new storage provider without explicit instruction.

---

# 40. SECRET QUESTION UI

The provided UI contains:

```text
Tạo Câu Hỏi Bí Mật Xác Minh
```

Finder:

```text
Question
+
Answer
```

The frontend sends:

```text
Question
Answer
```

to:

```text
POST /api/lost-found/{postId}/secret-question
```

The frontend must never display the stored secret answer after it is saved.

---

# 41. CLAIM UI

The provided UI contains:

```text
Xác Minh Sở Hữu Tài Sản
```

The user sees:

```text
Câu hỏi bí mật
```

then enters:

```text
Câu trả lời
```

and submits:

```text
Gửi Câu Trả Lời Cho Finder
```

Flow:

```text
GET secret-question
        ↓
Display Question
        ↓
User enters Answer
        ↓
POST claim
        ↓
Backend verifies answer
        ↓
Claim created
```

Do not reveal whether the stored answer is correct except through the appropriate claim result.

---

# 42. CLAIM REVIEW UI

Finder can see:

```text
Claims
```

using:

```text
GET /api/lost-found/{postId}/claims
```

The Finder can then:

```text
Approve
Reject
```

using:

```text
PUT /api/lost-found/claims/{claimId}/approve

PUT /api/lost-found/claims/{claimId}/reject
```

Only the owner/Finder should be able to perform these operations.

---

# 43. RETURNED UI

After a successful handover:

```text
Finder
    ↓
Xác nhận đã trả đồ
    ↓
PUT /api/lost-found/{postId}/returned
    ↓
Status = Returned
```

The frontend must refresh the post/list/map state from the backend.

Do not simply change the UI locally and assume the database was updated.

---

# 44. LOADING / ERROR / EMPTY STATES

Frontend must handle:

```text
Loading
Success
Empty
Error
```

Example:

```text
Loading:
"Đang tải đồ thất lạc..."

Empty:
"Chưa tìm thấy đồ phù hợp."

Error:
"Không thể tải dữ liệu Lost & Found."
```

For claims:

```text
"Đang tải yêu cầu nhận đồ..."

"Chưa có yêu cầu nhận đồ."

"Không thể tải yêu cầu."
```

Do not use fake fallback data.

---

# 45. AUTHORIZATION / OWNERSHIP RULE

Authentication:

```text
Is the user logged in?
```

Authorization:

```text
Is this user allowed to perform this operation?
```

Examples:

```text
Create Secret Question
    ↓
Must own Found Post

Get Claims
    ↓
Must own Found Post

Approve Claim
    ↓
Must own related Found Post

Reject Claim
    ↓
Must own related Found Post

Mark Returned
    ↓
Must own Found Post
```

Do not trust:

```text
userId
ownerId
finderId
```

sent by frontend when the backend can determine the current user from JWT.

---

# 46. SECURITY

Never expose:

```text
PasswordHash
JWT
JWT Secret
Connection String
Secret Answer
Internal Security Information
```

The Secret Answer must remain private.

Use safe Response DTOs.

Do not expose EF entities directly.

Do not log secret answers.

Do not put secret answers in frontend localStorage.

---

# 47. DATABASE

Module 3 should reuse:

```text
User
Post
```

from existing modules.

Possible additional data:

```text
SecretQuestion
Claim
```

Only create new database structures that are required by the current Module 3 API contract.

Do not create:

```text
Chat tables
Notification tables
Leaderboard tables
Reputation tables
Admin report tables
```

as part of the current Module 3 implementation unless explicitly requested.

If database schema changes:

```text
Create migration
    ↓
Update database
```

Follow the existing EF Core migration workflow.

---

# 48. BATCH PLAN

Module 3 is implemented incrementally.

---

## BATCH 1 — LOST & FOUND LIST + MAP

### Backend

Implement ONLY:

```text
GET /api/lost-found?type=Lost

GET /api/lost-found?type=Found

GET /api/lost-found?status=Returned

GET /api/lost-found/map
```

Backend responsibilities:

```text
[Authorize]

Load existing Post data

Filter Lost / Found / Returned

Load Lat / Lng

Map to Response DTO

Return HTTP response
```

Do not implement:

```text
Secret Question
Claim
Approve
Reject
Returned operation
Chat
Notification
```

### Frontend

Implement:

```text
LostFoundPage.jsx
LostFoundFilter.jsx
LostFoundList.jsx
LostFoundCard.jsx
LostFoundMap.jsx

lostFoundService.js
```

UI:

```text
Campus Lost & Found
    ↓
Tất cả
Cần Tìm
Nhặt Được
Đã Trao Trả
    ↓
List
    +
Campus Map
```

Handle:

```text
Loading
Error
Empty
Success
```

---

# BATCH 2 — SECRET QUESTION

### Backend

Implement ONLY:

```text
POST /api/lost-found/{postId}/secret-question

GET /api/lost-found/{postId}/secret-question
```

Implement:

```text
Finder ownership
Secret Question
Secret Answer storage
Secret Answer protection
Response DTO
```

Rules:

```text
Finder creates question
Finder creates answer

Lost user can see question

Lost user MUST NOT see answer
```

### Frontend

Implement:

```text
SecretQuestionForm.jsx
SecretQuestionView.jsx
```

Flow:

```text
Finder
    ↓
Create Secret Question
    ↓
Save

Lost User
    ↓
View Secret Question
    ↓
Enter Answer
```

Do not implement Claim yet.

---

# BATCH 3 — CLAIM

### Backend

Implement ONLY:

```text
POST /api/lost-found/{postId}/claims

GET /api/lost-found/{postId}/claims
```

Implement:

```text
Claim creation
Secret Answer verification
Claim status
Finder ownership validation
Claim Response DTO
```

Flow:

```text
Lost User
    ↓
Answer Secret Question
    ↓
Create Claim
    ↓
Pending
    ↓
Finder sees Claim
```

### Frontend

Implement:

```text
ClaimForm.jsx
ClaimList.jsx
```

Flow:

```text
Secret Question
    ↓
Answer
    ↓
Submit Claim
    ↓
Pending
    ↓
Finder views Claim
```

Do not implement Approve/Reject yet.

---

# BATCH 4 — APPROVE / REJECT / RETURNED

### Backend

Implement ONLY:

```text
PUT /api/lost-found/claims/{claimId}/approve

PUT /api/lost-found/claims/{claimId}/reject

PUT /api/lost-found/{postId}/returned
```

Implement:

```text
Finder authorization
Claim state validation
Approve
Reject
Returned state
Database persistence
```

Flow:

```text
Pending
   ↓
Finder Review
   ↓
Approve / Reject

Approve
   ↓
Handover
   ↓
Returned
```

### Frontend

Implement:

```text
Approve button
Reject button
Confirm Returned button
Status display
```

Do not implement:

```text
SignalR
Chat
Notification
Reputation
Leaderboard
Admin moderation
```

---

# BATCH 5 — INTEGRATION / VERIFICATION ONLY

This batch creates NO new API.

NO new business feature.

NO new database feature.

Only verify:

```text
Lost API
Found API
Returned filter
Map API

Secret Question

Claim

Approve

Reject

Returned

JWT Authentication

Ownership Authorization

Secret Answer Security

Database Persistence

API ↔ FE integration
```

Also verify:

```text
Lost → Found → Claim → Approve → Returned
```

Do not add new endpoints.

Do not add new features.

Do not expand Module 3 scope.

---

# 49. BATCH EXECUTION RULE

When the task says:

```text
Implement MODULE 3 BATCH 1
```

implement ONLY:

```text
Lost & Found List + Map
BE + FE
```

Do not implement Batch 2, 3, 4 or 5.

---

When the task says:

```text
Implement MODULE 3 BATCH 2
```

implement ONLY:

```text
Secret Question
BE + FE
```

Do not implement Claim.

---

When the task says:

```text
Implement MODULE 3 BATCH 3
```

implement ONLY:

```text
Claim
BE + FE
```

Do not implement Approve/Reject/Returned.

---

When the task says:

```text
Implement MODULE 3 BATCH 4
```

implement ONLY:

```text
Approve
Reject
Returned
BE + FE
```

---

When the task says:

```text
Implement MODULE 3 BATCH 5
```

perform ONLY:

```text
Integration
Testing
Verification
Bug Fixing
```

Do not add new business functionality.

---

# 50. BE / FE EXECUTION ORDER

For each implementation batch:

```text
Read AI_GUIDE.md
        ↓
Read MODULE_3.md
        ↓
Inspect existing project
        ↓
Inspect Module 1 code
        ↓
Inspect current database models
        ↓
Implement Backend
        ↓
Build Backend
        ↓
Fix Backend errors
        ↓
Implement Frontend
        ↓
Connect API
        ↓
Build Frontend
        ↓
Verify
        ↓
Report changed files
        ↓
Stop
```

If backend does not build:

```text
STOP FE implementation
        ↓
Fix Backend
        ↓
Build again
        ↓
Continue
```

---

# 51. FILE CHANGE RULE

Before creating any new file:

```text
Inspect existing project first.
```

Reuse existing:

```text
User
Post
AppDbContext
Repositories
ICurrentUserService
JWT
MediatR
Dependency Injection
authService.js
React components
CSS conventions
API service conventions
```

Create only files required by the current batch.

Do not create all future Module 3 files in advance.

---

# 52. DO NOT INVENT

Do not invent:

```text
New authentication system
New User system
New Post system
New matching algorithm
New API endpoints
New roles
Random coordinates
Random MatchScore
Fake Lost & Found data
Fake claims
Fake secret answers
Fake status
New frontend framework
New architecture
Unrequested packages
```

Do not replace:

```text
Clean Architecture
MediatR
EF Core
SQL Server
JWT
React
Vite
```

Do not automatically implement:

```text
SignalR
Chat
Notification
Reputation
Leaderboard
Admin Moderation
```

---

# 53. MODULE 3 FEATURE BOUNDARY

The overall workflow may contain:

```text
Map
Matching
Notification
Report
Chat
Reputation
Rating
```

But the current Module 3 implementation scope is:

```text
1. Lost & Found Listing
2. Map
3. Secret Question
4. Claim
5. Claim Review
6. Returned
```

Therefore:

```text
Workflow feature
        ≠
Current API scope
```

Only implement the APIs explicitly defined in this file.

---

# 54. DEFINITION OF DONE — BACKEND

```text
[ ] Required API exists.

[ ] Correct HTTP method.

[ ] Correct route.

[ ] [Authorize] applied.

[ ] Current user uses ICurrentUserService.

[ ] Existing User/Post system is reused.

[ ] Response DTO is used.

[ ] EF entities are not exposed directly.

[ ] Secret Answer is never exposed.

[ ] Ownership authorization is implemented.

[ ] Claim authorization is implemented.

[ ] Returned state is persisted.

[ ] Lat/Lng are handled correctly.

[ ] Haversine is not implemented in Controller.

[ ] TF-IDF is not implemented in Controller.

[ ] No business logic is in Controller.

[ ] No direct DbContext access from Controller.

[ ] Existing Module 1 APIs still work.

[ ] Backend builds successfully.
```

---

# 55. DEFINITION OF DONE — FRONTEND

```text
[ ] Required UI exists.

[ ] API calls are inside lostFoundService.js.

[ ] Existing JWT mechanism is reused.

[ ] Lost list works.

[ ] Found list works.

[ ] Returned list works.

[ ] Map works when requested.

[ ] Secret Question UI works.

[ ] Claim UI works.

[ ] Approve works when requested.

[ ] Reject works when requested.

[ ] Returned works when requested.

[ ] Secret Answer is not displayed.

[ ] No fake Lost & Found data.

[ ] No fake coordinates.

[ ] No fake MatchScore.

[ ] Loading state works.

[ ] Error state works.

[ ] Empty state works.

[ ] Existing login/register/home flow still works.

[ ] Frontend builds successfully.
```

---

# 56. FINAL DEFINITION OF DONE

```text
[ ] Only requested batch was implemented.

[ ] No unrelated modules were changed.

[ ] No duplicate User system was created.

[ ] No duplicate Post system was created.

[ ] No duplicate Authentication system was created.

[ ] Existing Module 1 code still works.

[ ] No new architecture was introduced.

[ ] No future Chat system was implemented.

[ ] No future SignalR system was implemented.

[ ] No future Notification system was implemented.

[ ] No future Reputation system was implemented.

[ ] No future Leaderboard system was implemented.

[ ] No Admin Moderation system was implemented.

[ ] Changed files are reported.

[ ] Created files are reported.

[ ] Backend build is successful.

[ ] Frontend build is successful.
```

---

# 57. AI EXECUTION

Before coding:

```text
1. Read AI_GUIDE.md.

2. Read MODULE_3.md.

3. Inspect the existing Module 1 Authentication code.

4. Inspect the existing Post model.

5. Inspect User.

6. Inspect AppDbContext.

7. Inspect existing repositories.

8. Inspect existing MediatR patterns.

9. Inspect existing JWT / ICurrentUserService.

10. Inspect existing React components.

11. Inspect authService.js.

12. Implement ONLY the requested Module 3 batch.

13. Implement Backend first.

14. Build Backend.

15. Fix Backend errors.

16. Implement Frontend.

17. Connect Frontend to Backend.

18. Build Frontend.

19. Verify the complete requested batch.

20. Report created/modified files.

21. Stop.
```

If the task says:

```text
BE
```

modify backend only.

If the task says:

```text
FE
```

modify frontend only.

If the task says:

```text
BE + FE
```

implement both.

If the task says:

```text
MODULE 3 BATCH X
```

implement ONLY that batch.

The existing Module 1 Authentication implementation is the Golden Reference for coding style.

`AI_GUIDE.md` defines HOW the project must be coded.

`MODULE_3.md` defines WHAT Module 3 must implement and WHICH batch may be implemented.

Do not implement anything outside the requested batch.
