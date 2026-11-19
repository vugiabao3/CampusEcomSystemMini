# MODULE 1 — ACCOUNT MANAGEMENT

## 1. Purpose

Module 1 manages:

* Authentication
* User Profile
* User Preferences / Demand Vector
* User Posts
* Post Likes
* Post Filters

This module is the foundation for later modules.

Module 2 uses the user's Preferences / Demand Vector.

All implementation must follow the existing project code and `AI_GUIDE.md`.

---

# 2. GOLDEN REFERENCE — EXISTING CODE

The existing Authentication implementation is the reference pattern for all new features.

Completed APIs:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Existing backend pattern:

```text
Controller
    ↓
MediatR Command / Query
    ↓
Handler
    ↓
Application Interface
    ↓
Infrastructure Implementation
    ↓
EF Core
    ↓
SQL Server
```

Existing frontend pattern:

```text
React Component
    ↓
Service
    ↓
HTTP API
    ↓
Backend
```

Do not create another pattern.

Do not introduce another architecture.

Do not rewrite the Authentication implementation unless explicitly required.

---

# 3. EXISTING PROJECT STRUCTURE

## Backend

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
│   │   ├── Login
│   │   │   ├── LoginCommand.cs
│   │   │   ├── LoginHandler.cs
│   │   │   └── LoginResponse.cs
│   │   └── Me
│   │       ├── MeQuery.cs
│   │       ├── MeHandler.cs
│   │       └── MeResponse.cs
│   ├── Logout
│   │   ├── LogoutCommand.cs
│   │   └── LogoutHandler.cs
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

## Frontend

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

Extend this structure instead of redesigning it.

---

# 4. USER ENTITY

Current User entity:

```csharp
public class User
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? AvatarUrl { get; set; }

    public string Role { get; set; } = "User";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
```

Do not rename existing fields unless explicitly required.

Roles currently:

```text
User
Admin
```

Do not create additional roles.

---

# 5. AUTHENTICATION — COMPLETED

These APIs already exist and are the Golden Reference.

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Do not recreate them.

Frontend authentication uses:

```text
authService.js
localStorage
JWT Bearer Token
```

The frontend must not contain the JWT secret.

Protected requests must attach:

```text
Authorization: Bearer <token>
```

Current authenticated user must be obtained through:

```text
ICurrentUserService
        ↓
CurrentUserService
        ↓
ClaimTypes.NameIdentifier
```

Never ask the frontend to send `userId` for `/me` operations.

---

# 6. PROFILE

## APIs

```text
GET /api/users/me
PUT /api/users/me
PUT /api/users/me/avatar
PUT /api/users/me/password
```

All require:

```text
[Authorize]
```

## 6.1 Get Profile

```text
GET /api/users/me
```

Purpose:

Return the currently authenticated user's profile.

User identity comes from `ICurrentUserService`.

Do not accept:

```text
userId
```

from route/query/body.

Expected profile data:

```text
Id
FullName
Email
Phone
AvatarUrl
Role
```

Do not expose:

```text
PasswordHash
```

## 6.2 Update Profile

```text
PUT /api/users/me
```

Editable fields:

```text
FullName
Email
Phone
```

Do not allow the client to modify:

```text
Id
PasswordHash
Role
CreatedAt
UpdatedAt
```

Use the authenticated user's ID from `ICurrentUserService`.

## 6.3 Update Avatar

```text
PUT /api/users/me/avatar
```

Purpose:

Update the authenticated user's avatar.

The API contract must follow the existing frontend/backend implementation decision.

Do not introduce Cloudinary, S3 or another storage provider unless explicitly requested.

For the current implementation, `AvatarUrl` is the persisted user field.

## 6.4 Change Password

```text
PUT /api/users/me/password
```

Request must contain:

```text
CurrentPassword
NewPassword
```

Rules:

1. Find current user using `ICurrentUserService`.
2. Verify current password using `IPasswordHasher`.
3. Reject if current password is incorrect.
4. Hash the new password using `IPasswordHasher`.
5. Save the new `PasswordHash`.
6. Never return `PasswordHash`.

---

# 7. PREFERENCES / DEMAND VECTOR

Module 2 depends on this data.

APIs:

```text
POST   /api/users/me/preferences
GET    /api/users/me/preferences
PUT    /api/users/me/preferences
DELETE /api/users/me/preferences
```

All require authentication.

## Purpose

Store structured user preferences used later by Smart Matching.

Current UI fields:

```text
Interested Subjects
Habits
Goals
Preferred Rental Area
Monthly Rental Budget
```

The UI also references free-time / schedule information in the workflow.

Do not invent additional fields.

If a field is not yet defined in the final API contract, mark it as TBD instead of inventing it.

## Rules

* One authenticated user owns their own preferences.
* Never accept another user's `userId` from frontend.
* Preferences must be associated with the authenticated user.
* Module 2 can read this data later.
* Do not implement Module 2 matching algorithms in Module 1.
* Do not implement TF-IDF, vector similarity or Matching Graph logic here.

## Database

If Preferences does not yet exist:

```text
Create:
- Preference entity
- DbSet
- Repository/interface if required
- Commands/Queries/Handlers
- Migration
```

Only create database structures required by Preferences.

Do not create tables for future modules.

---

# 8. USER POSTS

The UI contains:

```text
Bài đăng của tôi
Đăng bài mới
```

Posts support CRUD.

APIs:

```text
GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
GET    /api/posts/me
```

## Ownership

Normal User:

* Can create posts.
* Can view posts.
* Can update their own posts.
* Can delete their own posts.
* Cannot modify another user's post.

Use `ICurrentUserService` to determine ownership.

Do not trust a frontend-provided owner/user ID.

## Post data

The exact Post fields must follow the agreed API/UI contract.

The UI currently supports categories such as:

```text
Room
Group
Lost-Found
library
```

Existing UI examples also show:

```text
Thuê & Ở ghép trọ
Ghép nhóm học tập
Đổi sách giáo trình
Tài liệu số
```

Do not create unrelated Post fields or business logic unless required.

## Post creation

```text
POST /api/posts
```

Create a post for the authenticated user.

Owner ID comes from:

```text
ICurrentUserService
```

not from the frontend.

## Get My Posts

```text
GET /api/posts/me
```

Return only posts belonging to the authenticated user.

## Update

```text
PUT /api/posts/{id}
```

Before updating:

```text
Find post
    ↓
Check current user owns post
    ↓
Update allowed fields
```

If the user does not own the post, reject the operation.

## Delete

```text
DELETE /api/posts/{id}
```

Check ownership before deletion.

Do not implement Admin moderation here unless explicitly requested by another batch/module.

---

# 9. POST LIKES

APIs:

```text
POST   /api/posts/{id}/like
DELETE /api/posts/{id}/like
GET    /api/posts/{id}/likes
```

Authentication is required.

## Rules

* A user can like a post.
* A user should not create duplicate likes.
* A user can remove their own like.
* Like ownership comes from `ICurrentUserService`.
* Do not accept `userId` from frontend.
* Like data must be persisted.

If a Like entity does not exist, create only the required Like entity/table/repository/migration.

Do not create unrelated social-network functionality.

Post history is already provided by:

```text
GET /api/posts/me
```

---

# 10. POST FILTERS

Filtering uses the existing Post list API.

Examples:

```text
GET /api/posts?type=Room
GET /api/posts?type=Group
GET /api/posts?type=Lost-Found
GET /api/posts?type=library
GET /api/posts?time=Today
```

Combined filters must be supported if both parameters are supplied:

```text
GET /api/posts?type=Room&time=Today
```

Do not create separate endpoints for every filter.

Use query parameters on:

```text
GET /api/posts
```

Frontend filter controls must call the same API.

---

# 11. FRONTEND RULES

Use the existing React + Vite structure.

```text
components/
services/
styles/
App.jsx
main.jsx
```

Rules:

* Components contain UI and UI state.
* API calls belong in `services/`.
* Do not duplicate fetch logic in every component.
* Reuse the existing authentication token handling.
* Reuse the existing API base URL configuration.
* Do not create a second API client unless required.
* Use functional React components.
* Keep the existing visual style unless the task explicitly asks for redesign.

Existing frontend service:

```text
authService.js
```

New services should follow the same style:

```text
userService.js
preferenceService.js
postService.js
```

Only create a service when needed.

---

# 12. FRONTEND → BACKEND MAPPING

```text
LoginForm
    ↓
authService.login()
    ↓
POST /api/auth/login

RegisterForm
    ↓
authService.register()
    ↓
POST /api/auth/register

App startup
    ↓
authService.getMe()
    ↓
GET /api/auth/me

Logout
    ↓
authService.logout()
    ↓
POST /api/auth/logout
```

Profile:

```text
UserProfile
    ↓
userService.getMe()
    ↓
GET /api/users/me
```

Edit Profile:

```text
EditProfile
    ↓
userService.updateProfile()
    ↓
PUT /api/users/me
```

Avatar:

```text
Avatar UI
    ↓
userService.updateAvatar()
    ↓
PUT /api/users/me/avatar
```

Password:

```text
ChangePassword
    ↓
userService.changePassword()
    ↓
PUT /api/users/me/password
```

Preferences:

```text
Preferences UI
    ↓
preferenceService
    ↓
POST / GET / PUT / DELETE
/api/users/me/preferences
```

Posts:

```text
Post List
    ↓
postService.getPosts()
    ↓
GET /api/posts
```

My Posts:

```text
My Posts
    ↓
postService.getMyPosts()
    ↓
GET /api/posts/me
```

Create:

```text
Create Post Modal
    ↓
postService.createPost()
    ↓
POST /api/posts
```

Update:

```text
Edit Post
    ↓
postService.updatePost()
    ↓
PUT /api/posts/{id}
```

Delete:

```text
Delete Post
    ↓
postService.deletePost()
    ↓
DELETE /api/posts/{id}
```

Like:

```text
Like Button
    ↓
postService.likePost()
    ↓
POST /api/posts/{id}/like
```

Unlike:

```text
Unlike Button
    ↓
postService.unlikePost()
    ↓
DELETE /api/posts/{id}/like
```

Filters:

```text
Filter UI
    ↓
GET /api/posts?type=...&time=...
```

---

# 13. UI REFERENCE

The official UI reference for this project is:

```text
GIAO_DIEN_MODULE_1,2,3,4,5,6.HTML
```

Module 1 UI includes:

```text
Login
Register
Home
Profile
Edit Profile
Change Password
Vector Nhu cầu
My Posts
Create Post
Post Filters
Like
```

The existing UI is the visual reference.

Do not redesign the whole application when implementing a single feature.

Only modify the relevant component/style.

---

# 14. BATCH IMPLEMENTATION ORDER

Implement Module 1 incrementally.

```text
BATCH 1 — Authentication
STATUS: COMPLETED

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout


BATCH 2 — Profile

GET /api/users/me
PUT /api/users/me
PUT /api/users/me/avatar
PUT /api/users/me/password


BATCH 3 — Preferences

POST   /api/users/me/preferences
GET    /api/users/me/preferences
PUT    /api/users/me/preferences
DELETE /api/users/me/preferences


BATCH 4 — Posts

GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
GET    /api/posts/me


BATCH 5 — Likes

POST   /api/posts/{id}/like
DELETE /api/posts/{id}/like
GET    /api/posts/{id}/likes


BATCH 6 — Filters

GET /api/posts?type=...
GET /api/posts?time=...
GET /api/posts?type=...&time=...
```

Each batch should be implemented and verified before moving to the next batch.

If the task says:

```text
Implement BATCH 2
```

implement only BATCH 2.

Do not implement BATCH 3–6.

---

# 15. BACKEND FILE PATTERN

Follow the existing Authentication pattern.

Example:

```text
Application
└── Users
    └── Profile
        ├── GetProfileQuery.cs
        ├── GetProfileHandler.cs
        └── GetProfileResponse.cs
```

For commands:

```text
UpdateProfileCommand.cs
UpdateProfileHandler.cs
UpdateProfileResponse.cs
```

Repository abstractions:

```text
Application/Interfaces
```

Implementations:

```text
Infrastructure/Repositories
```

Entities:

```text
Domain/Entities
```

Controllers:

```text
Api/Controllers
```

Do not put business logic inside controllers.

---

# 16. DATABASE RULE

Do not create the entire Module 1 database in advance.

Create database structures incrementally.

Example:

```text
BATCH 2
User already exists
No new User table.

BATCH 3
Create Preferences entity/table only if required.

BATCH 4
Create Post entity/table only if required.

BATCH 5
Create Like entity/table only if required.
```

Whenever schema changes:

```text
Entity
    ↓
AppDbContext
    ↓
EF Core Migration
    ↓
Database
```

Do not delete existing data or reset the database unless explicitly requested.

---

# 17. ERROR / VALIDATION RULES

Validate input at the appropriate layer.

At minimum:

```text
Invalid input
    ↓
Return appropriate 4xx response
```

Authentication errors must not expose sensitive information.

Never return:

```text
PasswordHash
JWT secret
database connection string
```

Use existing error-handling conventions if already present.

Do not introduce a new global exception framework unless required.

---

# 18. DEFINITION OF DONE

A batch is complete only when:

### Backend

```text
[ ] Required endpoints exist.
[ ] Correct HTTP methods/routes are used.
[ ] [Authorize] is used where required.
[ ] Current user comes from ICurrentUserService.
[ ] Controllers contain no business logic.
[ ] MediatR pattern is followed.
[ ] Application uses interfaces.
[ ] Infrastructure contains EF Core/repository implementation.
[ ] Existing APIs still work.
[ ] Database migration exists if schema changed.
[ ] Backend builds successfully.
```

### Frontend

```text
[ ] Required UI exists.
[ ] UI follows the provided design.
[ ] API calls are in services/.
[ ] JWT is attached to protected requests.
[ ] Loading state is handled.
[ ] Error state is handled.
[ ] Success state/UI is handled where needed.
[ ] Existing authentication flow still works.
[ ] Frontend builds successfully.
```

### Final

```text
[ ] Only requested batch was changed.
[ ] No unrelated module was modified.
[ ] No new framework was introduced.
[ ] No unnecessary refactoring was performed.
[ ] Changed/created files are reported.
```

---

# 19. DO NOT IMPLEMENT

While implementing Module 1, do NOT automatically implement:

```text
Smart Matching algorithm
TF-IDF
Matching Graph Cycle
Lost & Found verification algorithm
SignalR chat
Notification system
Library/Document system
Watermark
Gamification
Leaderboard
Admin dashboard
Cloud storage integration
AWS S3
Cloudinary
```

These belong to later modules unless explicitly requested.

Module 1 only prepares the user/profile/preferences/post data required by later modules.

---

# 20. AI TASK EXECUTION RULE

Before coding:

```text
1. Read AI_GUIDE.md.
2. Read this MODULE_1.md.
3. Inspect the existing Authentication code.
4. Inspect existing project structure.
5. Identify reusable interfaces/services.
6. Implement only the requested batch.
7. Build/test.
8. Report changed files.
```

When a task says:

```text
BE
```

modify backend only.

When a task says:

```text
FE
```

modify frontend only.

When a task says:

```text
BE + FE
```

implement both sides and connect them using the documented API contract.

Never implement future batches automatically.

Never invent undocumented requirements.

The existing Authentication implementation is the Golden Reference for coding style and architecture.
