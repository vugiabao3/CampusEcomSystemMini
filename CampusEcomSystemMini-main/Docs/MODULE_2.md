# MODULE 2 — SMART MATCHING

## 1. Purpose

Module 2 provides Smart Matching for:

```text
1. Tìm nhóm học / cạ học
2. Tìm người ở ghép / tìm trọ
```

The core algorithm is:

```text
User Preferences
      ↓
Feature Vector
      ↓
Candidate Vectors
      ↓
Cosine Similarity
      ↓
Match Score %
      ↓
Apply Threshold
      ↓
Sort DESC
      ↓
Return Smart Match Results
```

The architecture defines Cosine Similarity as the core algorithm for finding compatible study partners and roommates. The vector has 4 dimensions:

```text
x1 = Habits / lifestyle
x2 = Goals
x3 = Geographic / location compatibility
x4 = Desired rental budget
```

Formula:

```text
Similarity(A, B)
=
(A · B) / (||A|| × ||B||)
```

The result is converted to percentage:

```text
MatchScore = Similarity × 100
```

Do not replace this algorithm with another algorithm.

---

# 2. GOLDEN REFERENCE — EXISTING PROJECT

All Module 2 code must follow the existing Module 1 Authentication implementation.

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
│   │   ├── Login
│   │   └── Me
│   ├── Logout
│   ├── Interfaces
│   │   ├── IUserRepository.cs
│   │   ├── IPasswordHasher.cs
│   │   ├── IJwtTokenService.cs
│   │   └── ICurrentUserService.cs
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
└── src
    ├── components
    │   ├── LoginForm.jsx
    │   ├── RegisterForm.jsx
    │   ├── HomePage.jsx
    │   └── UserProfile.jsx
    ├── services
    │   └── authService.js
    ├── styles
    │   └── auth.css
    ├── App.jsx
    └── main.jsx
```

Follow the same architecture.

Do not create another architecture.

Do not replace MediatR.

Do not replace the existing JWT implementation.

Do not rewrite working Module 1 code.

---

# 3. ARCHITECTURE

Backend:

```text
HTTP Request
    ↓
Controller
    ↓
MediatR Query
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

Cosine calculation belongs to the backend.

The frontend must NOT calculate or invent MatchScore.

---

# 4. MODULE 2 API CONTRACT

Module 2 currently contains exactly these APIs:

## Student Matching

```text
GET /api/matching/students
GET /api/matching/students/{userId}
```

## Room Matching

```text
GET /api/matching/rooms
GET /api/matching/rooms/{userId}
```

All matching APIs require authentication:

```text
[Authorize]
```

Do not add other Module 2 endpoints unless explicitly requested.

---

# 5. CURRENT USER

For:

```text
GET /api/matching/students
GET /api/matching/rooms
```

the current user is obtained from:

```text
ICurrentUserService
        ↓
CurrentUserService
        ↓
JWT ClaimTypes.NameIdentifier
```

Do not require the frontend to send the current user's ID.

Do not read JWT claims directly inside every Handler.

Reuse the existing `ICurrentUserService`.

---

# 6. PREFERENCE SOURCE

Module 2 uses the Preferences created by Module 1.

Module 2 must reuse the existing Preference data.

Do not create another User Preference system.

The current UI defines these preference inputs:

```text
Interested Subjects
Habits
Goals
Preferred Rental Area
Monthly Rental Budget
```

The architecture/workflow defines the matching vector as:

```text
A = [x1, x2, x3, x4]

x1 = Habits / lifestyle
x2 = Goals
x3 = Geographic compatibility
x4 = Desired rental budget
```

Do not invent additional dimensions.

If the existing Module 1 implementation uses a different field name, map that field to the corresponding vector dimension instead of creating duplicate fields.

---

# 7. VECTOR NORMALIZATION

The matching engine must compare numeric feature vectors.

Conceptually:

```text
User A
    ↓
Preferences
    ↓
Normalize features
    ↓
Vector A = [x1, x2, x3, x4]

User B
    ↓
Preferences
    ↓
Normalize features
    ↓
Vector B = [x1, x2, x3, x4]
```

Both vectors must use the same dimension order.

Do not compare raw text directly using the cosine formula.

Do not use random values.

Do not hard-code match percentages.

If a required preference value cannot be converted into a valid feature, follow the existing agreed data rule rather than inventing a new algorithm.

---

# 8. COSINE SIMILARITY

Use:

```text
Similarity(A, B)
=
(A · B) / (||A|| × ||B||)
```

Dot product:

```text
A · B
=
A1×B1 + A2×B2 + A3×B3 + A4×B4
```

Vector magnitude:

```text
||A||
=
sqrt(A1² + A2² + A3² + A4²)

||B||
=
sqrt(B1² + B2² + B3² + B4²)
```

Then:

```text
MatchScore = Similarity × 100
```

Example:

```text
Similarity = 0.85

MatchScore = 85%
```

The architecture specification explicitly uses this Cosine Similarity model.

---

# 9. ZERO-VECTOR SAFETY

If:

```text
||A|| == 0
```

or:

```text
||B|| == 0
```

do not divide by zero.

Return:

```text
Similarity = 0
MatchScore = 0%
```

The API must not crash because of an empty/zero preference vector.

---

# 10. MATCH THRESHOLDS

Use exactly these thresholds:

```text
Score < 40%
    → Low match
    → Do not return in Smart Match Radar results.

40% - 79%
    → Medium match
    → Return in Radar List.
    → No high-match notification.

>= 80%
    → High match
    → Return in Radar List.
    → Eligible for high-match notification integration later.
```

The Module 2 workflow defines these three ranges.

For the current 4 matching APIs:

```text
Score < 40%
```

is excluded from the Smart Match result list.

---

# 11. SORTING

Returned candidates must be sorted:

```text
MatchScore DESC
```

Example:

```text
92%
87%
84%
76%
61%
```

Never return candidates in random order.

The frontend must not perform the ranking itself.

Backend is responsible for ranking.

---

# 12. STUDENT MATCHING

## API

```text
GET /api/matching/students
```

Purpose:

Find compatible students for the authenticated user.

Flow:

```text
Authenticated User
        ↓
ICurrentUserService
        ↓
Load current User Preferences
        ↓
Load candidate Users
        ↓
Load candidate Preferences
        ↓
Build vectors
        ↓
Cosine Similarity
        ↓
Convert to MatchScore %
        ↓
Remove score < 40%
        ↓
Sort DESC
        ↓
Return results
```

Do not include the current user as their own candidate.

---

# 13. STUDENT MATCH DETAIL

## API

```text
GET /api/matching/students/{userId}
```

Purpose:

Calculate and return the compatibility between the authenticated user and the specified student.

Flow:

```text
Authenticated User
        ↓
ICurrentUserService
        ↓
Current User Preferences
        ↓
Target User
        ↓
Target User Preferences
        ↓
Build vectors
        ↓
Cosine Similarity
        ↓
MatchScore
        ↓
Return result
```

Do not calculate the score in React.

Backend is the source of truth.

If the target user does not exist:

```text
404 Not Found
```

If the current user or required preference data cannot be used for matching, return an appropriate error according to existing project conventions.

Do not expose sensitive user information.

---

# 14. ROOM MATCHING

## API

```text
GET /api/matching/rooms
```

Purpose:

Find compatible rental/roommate candidates.

Flow:

```text
Authenticated User
        ↓
ICurrentUserService
        ↓
Current User Preferences
        ↓
Load relevant room/rental candidates
        ↓
Extract matching features
        ↓
Build vectors
        ↓
Cosine Similarity
        ↓
MatchScore
        ↓
Remove score < 40%
        ↓
Sort DESC
        ↓
Return results
```

Room matching primarily uses:

```text
Habits / lifestyle
Goals / compatibility
Location
Rental budget
```

Use the data already defined by Module 1 and the Post model.

Do not create another rental preference system.

---

# 15. ROOM MATCH DETAIL

## API

```text
GET /api/matching/rooms/{userId}
```

Purpose:

Calculate compatibility with the specified room/rental candidate according to the current API contract.

Backend calculates:

```text
Feature Vector
    ↓
Cosine Similarity
    ↓
MatchScore
```

Do not calculate the score in the frontend.

---

# 16. RESPONSE RULE

Return only data needed by the matching UI.

Conceptual response:

```json
{
  "userId": "guid",
  "fullName": "Nguyen Van A",
  "avatarUrl": "...",
  "matchScore": 85
}
```

Additional fields may be returned only when required by the existing UI/API contract.

Never return:

```text
PasswordHash
JWT
JWT secret
database connection string
internal security data
```

Do not expose EF entities directly.

Use Response DTOs.

---

# 17. BACKEND FOLDER STRUCTURE

Follow the existing Application pattern.

Suggested:

```text
CampusEcomSystemMini.Application
└── Matching
    ├── Students
    │   ├── GetStudentMatches
    │   │   ├── GetStudentMatchesQuery.cs
    │   │   ├── GetStudentMatchesHandler.cs
    │   │   └── GetStudentMatchesResponse.cs
    │   │
    │   └── GetStudentMatch
    │       ├── GetStudentMatchQuery.cs
    │       ├── GetStudentMatchHandler.cs
    │       └── GetStudentMatchResponse.cs
    │
    └── Rooms
        ├── GetRoomMatches
        │   ├── GetRoomMatchesQuery.cs
        │   ├── GetRoomMatchesHandler.cs
        │   └── GetRoomMatchesResponse.cs
        │
        └── GetRoomMatch
            ├── GetRoomMatchQuery.cs
            ├── GetRoomMatchHandler.cs
            └── GetRoomMatchResponse.cs
```

If the existing project uses a slightly different naming structure, follow the existing project instead of blindly creating this exact tree.

---

# 18. MATCHING SERVICE

Cosine Similarity must not be duplicated in multiple Handlers.

Create one reusable application abstraction if needed:

```text
IMatchingService
```

The service is responsible for:

```text
Build/receive vectors
        ↓
Calculate Cosine Similarity
        ↓
Return similarity / score
```

The Handlers are responsible for:

```text
Load data
Validate data
Call matching service
Apply threshold
Map response
```

Do not put the cosine formula in:

```text
Controller
React component
multiple Handlers
```

---

# 19. CONTROLLER

Create:

```text
CampusEcomSystemMini.Api
└── Controllers
    └── MatchingController.cs
```

Controller responsibilities:

```text
Receive HTTP request
        ↓
Send MediatR Query
        ↓
Return HTTP response
```

Controller must NOT:

```text
Calculate Cosine Similarity
Query DbContext directly
Build vectors
Filter candidates manually
Contain business logic
```

---

# 20. DATABASE

Module 2 should reuse Module 1 data.

Primary sources:

```text
User
User Preferences
Post / Room data
```

Do not duplicate:

```text
User
Preferences
```

If Module 1 already provides the required Preferences entity/table, reuse it.

If a required room-specific data structure does not exist, add only the minimum structure required by the agreed Post/Room contract.

Do not create unrelated Module 3–6 tables.

---

# 21. FRONTEND — EXISTING STRUCTURE

Continue the existing React structure:

```text
CampusEcomSystemMini.Web
└── src
    ├── components
    ├── services
    ├── styles
    ├── App.jsx
    └── main.jsx
```

Add matching components only when required.

Suggested:

```text
components
└── matching
    ├── SmartMatching.jsx
    ├── StudentMatchList.jsx
    ├── RoomMatchList.jsx
    └── MatchCard.jsx
```

Do not create duplicate components if an existing component can be reused.

---

# 22. FRONTEND SERVICE

Create:

```text
services
└── matchingService.js
```

All Module 2 API calls belong here.

Methods conceptually:

```javascript
getStudentMatches()
getStudentMatch(userId)

getRoomMatches()
getRoomMatch(userId)
```

Mapping:

```text
getStudentMatches()
    ↓
GET /api/matching/students

getStudentMatch(userId)
    ↓
GET /api/matching/students/{userId}

getRoomMatches()
    ↓
GET /api/matching/rooms

getRoomMatch(userId)
    ↓
GET /api/matching/rooms/{userId}
```

Reuse the existing authentication token mechanism from `authService.js`.

Do not duplicate token storage logic.

---

# 23. STUDENT MATCH UI

The existing UI provides:

```text
SMART MATCHING
    ↓
Tìm nhóm học
```

The matching UI should display compatible students based on the backend result.

Flow:

```text
User opens Smart Matching
        ↓
Select "Tìm nhóm học"
        ↓
matchingService.getStudentMatches()
        ↓
GET /api/matching/students
        ↓
Backend calculates scores
        ↓
Return ranked candidates
        ↓
Render Match Cards
```

Each card should display relevant information from the API, including:

```text
Avatar
Name
Match Score
Relevant profile information
```

Do not calculate MatchScore again in React.

The provided UI describes Smart Matching as suggestions based on the user's Demand Vector.

---

# 24. ROOM MATCH UI

The existing UI provides:

```text
SMART MATCHING
    ↓
Tìm trọ / Ở ghép
```

Flow:

```text
User opens Smart Matching
        ↓
Select "Tìm trọ / Ở ghép"
        ↓
matchingService.getRoomMatches()
        ↓
GET /api/matching/rooms
        ↓
Backend calculates scores
        ↓
Return ranked candidates
        ↓
Render Room Match Cards
```

Display relevant rental information from the API.

Do not create fake room data when backend data exists.

---

# 25. MATCH SCORE DISPLAY

Backend returns:

```text
matchScore
```

Frontend only displays it.

Example:

```text
92% Match
85% Match
73% Match
```

Frontend must not:

```text
recalculate score
change score
generate random score
```

The backend is the single source of truth.

---

# 26. LOADING / ERROR / EMPTY STATES

The frontend must handle:

```text
Loading
Success
Empty
Error
```

Example:

```text
Loading:
"Đang tìm người phù hợp..."

Empty:
"Chưa tìm thấy người phù hợp."

Error:
"Không thể tải kết quả Smart Matching."
```

Do not use fake fallback matching data.

---

# 27. LOW MATCH FALLBACK

If all candidates have:

```text
Score < 40%
```

the backend returns no Smart Match candidates.

The frontend should display an empty state and allow the user to return/change their preferences.

Conceptually:

```text
No Match
    ↓
Change Preferences
    OR
Return to Feed
```

Do not automatically lower the threshold.

The threshold remains:

```text
40%
```

---

# 28. HIGH MATCH

For:

```text
MatchScore >= 80%
```

the result is classified as:

```text
High Match
```

The architecture/workflow describes notification integration for high matches.

However, the current Module 2 API contract does NOT include a notification endpoint.

Therefore:

```text
DO NOT implement:
SignalR notification
Push notification
Notification database
Chat
Connection Request
```

as part of these four APIs.

Only return the correct MatchScore.

Later modules/features may consume this result.

---

# 29. CONNECTION / CHAT BOUNDARY

The Module 2 workflow contains a later flow:

```text
View Match
    ↓
Send Connection Request
    ↓
Pending
    ↓
Accept / Reject
    ↓
Matched
    ↓
Open Chat
```

It also contains SignalR interaction.

These are outside the current four-API Module 2 contract.

Therefore do NOT automatically create:

```text
POST /api/connections
PUT /api/connections/{id}
GET /api/connections
SignalR Hub
Chat APIs
Notification APIs
```

unless explicitly requested later.

---

# 30. MODERATION BOUNDARY

The workflow also describes:

```text
Report Post
    ↓
Admin Review
    ↓
Hide/Delete Post
    ↓
Penalize Author
```

This is not part of the current Module 2 API contract.

Do not implement:

```text
Reports
Admin moderation
Reputation penalties
```

in the current Smart Matching batch.

These belong to the appropriate later module.

---

# 31. BATCH PLAN

Module 2 is implemented incrementally.

## BATCH 1 — Student Matching

### Backend

```text
GET /api/matching/students
GET /api/matching/students/{userId}
```

Implement:

```text
Current User
Preferences
Candidate Students
Feature Vector
Cosine Similarity
MatchScore
40% threshold
DESC ranking
Response DTO
```

### Frontend

Implement:

```text
Smart Matching UI
Tìm nhóm học
Student Match List
Match Card
Match Score
Loading
Error
Empty
```

---

## BATCH 2 — Room Matching

### Backend

```text
GET /api/matching/rooms
GET /api/matching/rooms/{userId}
```

Implement:

```text
Room candidates
Room-related vector features
Cosine Similarity
MatchScore
40% threshold
DESC ranking
Response DTO
```

### Frontend

Implement:

```text
Tìm trọ / Ở ghép
Room Match List
Room Match Card
Match Score
Loading
Error
Empty
```

---

## BATCH 3 — Integration / Verification

Verify:

```text
Student Matching
Room Matching
Vector consistency
Cosine calculation
Threshold
Ranking
Authentication
API ↔ FE integration
```

Do not add new business features.

---

# 32. BATCH EXECUTION RULE

When the task says:

```text
Implement MODULE 2 BATCH 1
```

implement ONLY:

```text
Student Matching BE + FE
```

Do not implement Room Matching.

When the task says:

```text
Implement MODULE 2 BATCH 2
```

implement ONLY:

```text
Room Matching BE + FE
```

Do not modify unrelated modules.

For each batch:

```text
BE
 ↓
Build
 ↓
FE
 ↓
Connect API
 ↓
Build
 ↓
Verify
 ↓
Done
```

If backend fails to build, fix backend before continuing to FE integration.

---

# 33. FILE CHANGE RULE

Before creating a new file:

```text
Inspect existing project first.
```

Reuse existing:

```text
User
Preferences
AppDbContext
Repositories
ICurrentUserService
JWT
API service pattern
CSS conventions
```

Create only files required for the current batch.

Do not create all future Module 2 files in advance.

---

# 34. DO NOT INVENT

Do not invent:

```text
New matching algorithm
New vector dimensions
New API endpoints
New roles
New database systems
New authentication mechanism
New frontend framework
New package
Random MatchScore
Fake candidate data
```

Do not replace:

```text
Cosine Similarity
MediatR
Clean Architecture
EF Core
SQL Server
React + Vite
JWT
```

---

# 35. DEFINITION OF DONE

## Backend

```text
[ ] Required API exists.
[ ] Correct HTTP method and route.
[ ] [Authorize] applied.
[ ] Current user uses ICurrentUserService.
[ ] Preferences are loaded from database.
[ ] Candidate data comes from database.
[ ] Feature vectors use the defined dimensions.
[ ] Cosine Similarity is implemented correctly.
[ ] Zero-vector case does not crash.
[ ] MatchScore is converted to percentage.
[ ] Score < 40% is excluded.
[ ] Results are sorted MatchScore DESC.
[ ] Response DTO is used.
[ ] Sensitive fields are not exposed.
[ ] No business logic is in Controller.
[ ] No direct DbContext access from Controller.
[ ] Existing Module 1 APIs still work.
[ ] Backend builds successfully.
```

## Frontend

```text
[ ] Matching UI follows provided design.
[ ] Student matching works.
[ ] Room matching works when requested.
[ ] API calls are inside matchingService.js.
[ ] Existing JWT mechanism is reused.
[ ] MatchScore comes from backend.
[ ] No fake/random score is used.
[ ] Results are displayed correctly.
[ ] Loading state works.
[ ] Error state works.
[ ] Empty state works.
[ ] Existing login/register/home flow still works.
[ ] Frontend builds successfully.
```

## Final

```text
[ ] Only requested batch was implemented.
[ ] No unrelated modules were changed.
[ ] No duplicate User/Preference system was created.
[ ] No new architecture was introduced.
[ ] No future Chat/SignalR/Notification system was implemented.
[ ] Changed and created files are reported.
```

---

# 36. AI EXECUTION

Before coding:

```text
1. Read AI_GUIDE.md.
2. Read MODULE_2.md.
3. Inspect the existing Module 1 Authentication code.
4. Inspect User, Preferences and AppDbContext.
5. Inspect existing frontend service/component patterns.
6. Implement only the requested batch.
7. Implement BE first.
8. Build BE.
9. Implement FE.
10. Connect FE to the existing API.
11. Build FE.
12. Verify the complete batch.
13. Report created/modified files.
14. Stop.
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

The existing Module 1 Authentication implementation is the Golden Reference for the coding style of the entire project.

The architecture and workflow documents define the intended system behavior; this file defines the current implementation scope for Module 2.
