# AI GUIDE — CampusEcomSystemMini

## 1. Project

CampusEcomSystemMini is a student campus utility web application with 6 modules.

### Backend

* C#
* ASP.NET Core
* Clean Architecture
* MediatR
* Entity Framework Core
* SQL Server
* JWT Authentication

### Frontend

* React + Vite
* JavaScript + JSX
* HTML/CSS

---

## 2. Architecture

Backend follows Clean Architecture.

```text
API → Application → Domain
Infrastructure → Application / Domain
```

Rules:

* `Api`: HTTP/Controllers only.
* `Application`: use cases, Commands, Queries, Handlers, Responses, Interfaces.
* `Domain`: core Entities, Enums and domain concepts.
* `Infrastructure`: EF Core, DbContext, Repositories, JWT, Password Hashing and technical/external services.
* Controllers must not contain business logic.
* Controllers must not access `DbContext` directly.
* Application must depend on abstractions, not Infrastructure implementations.
* Use Dependency Injection.

---

## 3. Backend Folder Responsibilities

```text
CampusEcomSystemMini.Api
├── Controllers
├── Program.cs
└── appsettings.json

CampusEcomSystemMini.Application
├── Auth
│   ├── Register
│   ├── Login
│   └── Me
├── Logout
├── Interfaces
└── DependencyInjection.cs

CampusEcomSystemMini.Domain
└── Entities

CampusEcomSystemMini.Infrastructure
├── Data
├── Repositories
├── Security
├── Services
└── DependencyInjection.cs
```

Do not move or redesign this structure unless required.

---

## 4. Application Pattern

Use the existing pattern for new use cases.

### Command

```text
{Name}Command.cs
{Name}Handler.cs
{Name}Response.cs
```

### Query

```text
{Name}Query.cs
{Name}Handler.cs
{Name}Response.cs
```

Example:

```text
CreatePostCommand.cs
CreatePostHandler.cs
CreatePostResponse.cs
```

Handlers contain application/use-case logic.

Use `async/await` for I/O operations and `CancellationToken` where appropriate.

---

## 5. Interfaces & Infrastructure

Application defines abstractions:

```text
IUserRepository
IPasswordHasher
IJwtTokenService
ICurrentUserService
```

Infrastructure implements them:

```text
UserRepository
PasswordHasher
JwtTokenService
CurrentUserService
```

Rules:

* Reuse existing interfaces/services before creating new ones.
* Do not create duplicate services.
* Register implementations through Dependency Injection.
* EF Core code stays in Infrastructure.

---

## 6. Domain

Keep Domain simple and independent.

```text
Domain
└── Entities
```

Domain must not depend on:

* ASP.NET Core
* EF Core
* JWT
* HTTP
* Controllers
* Infrastructure

Do not put unnecessary business/application logic into Entities.

---

## 7. API Rules

Use REST-style endpoints.

```text
GET    /api/{resource}
GET    /api/{resource}/{id}
POST   /api/{resource}
PUT    /api/{resource}/{id}
DELETE /api/{resource}/{id}
```

Rules:

* Controllers receive requests and return HTTP responses.
* Use appropriate HTTP status codes.
* Do not expose EF entities directly as API responses.
* Use Request/Command/Query and Response models.
* Use `[Authorize]` for protected endpoints.
* Keep existing API contracts unchanged unless explicitly required.

---

## 8. Authentication

Authentication uses JWT.

JWT contains user identity information such as:

* UserId
* Email
* Role

Use the existing:

```text
ICurrentUserService
        ↓
CurrentUserService
```

to obtain the currently authenticated user.

Do not:

* Read JWT claims repeatedly in every Handler when `ICurrentUserService` can be used.
* Ask the frontend to send `userId` when it can be obtained from the authenticated JWT.
* Put JWT secrets in frontend code.

---

## 9. Database

Use:

* Entity Framework Core
* SQL Server

Rules:

* `DbContext` belongs to Infrastructure.
* Repository implementations belong to Infrastructure.
* Application uses repository interfaces.
* Do not access `DbContext` directly from Controllers.
* Follow the existing `AppDbContext` configuration.
* Create/update migrations when the database schema changes.

---

## 10. Frontend Structure

```text
CampusEcomSystemMini.Web
└── src
    ├── components
    ├── services
    ├── styles
    ├── App.jsx
    └── main.jsx
```

Responsibilities:

* `components/`: React UI components.
* `services/`: API calls and frontend service logic.
* `styles/`: CSS.
* `App.jsx`: main application composition.
* `main.jsx`: React entry point.

Use functional React components.

API calls should be placed in `services/`, not duplicated across components.

Use:

```text
VITE_API_URL
```

for the backend API base URL.

---

## 11. Naming

### Backend

```text
PascalCase

CreatePostCommand.cs
CreatePostHandler.cs
CreatePostResponse.cs
ICurrentUserService.cs
CurrentUserService.cs
PostController.cs
```

### Frontend

```text
React components → PascalCase.jsx
Services        → camelCase.js
```

Examples:

```text
LoginForm.jsx
UserProfile.jsx
authService.js
postService.js
```

Follow existing naming patterns.

---

## 12. Existing Code Protection

The existing code is the baseline.

When adding a feature:

1. Inspect existing code first.
2. Reuse existing patterns and services.
3. Make the smallest necessary changes.
4. Do not rewrite working code unnecessarily.
5. Do not change existing APIs without requirement.
6. Do not introduce another architecture/framework.
7. Do not create duplicate functionality.
8. Do not modify unrelated modules.
9. Keep all existing APIs working.
10. Follow the existing project structure.

---

## 13. AI Implementation Workflow

For every new feature/module:

```text
1. Read AI_GUIDE.md
2. Read the relevant MODULE_X.md
3. Inspect existing code
4. Identify reusable code
5. Determine required files/changes
6. Implement using existing patterns
7. Check dependencies and API contracts
8. Verify build/run
```

Important:

> `AI_GUIDE.md` defines HOW to code.
> `MODULE_X.md` defines WHAT to build.

Do not duplicate module-specific requirements inside `AI_GUIDE.md`.


## 14. Task Scope Rule

The AI must only implement the explicitly requested scope.

If backend only:
- Do not modify frontend.

If frontend only:
- Do not modify backend APIs.

If a batch is specified:
- Implement only that batch.
- Do not implement later batches.
- Do not modify unrelated modules.

Never implement the entire module unless explicitly requested.


## 15. Do Not Invent

The AI must not invent:

- New API endpoints
- New database fields
- New roles
- New frameworks
- New NuGet/npm packages
- New architecture patterns
- New business rules

unless explicitly required by the relevant MODULE_X.md or existing code.


## 16. Database Incremental Rule

Do not create all module database tables in advance.

Only create the Entity, DbSet, configuration and migration required by the current feature/batch.

Reuse existing database structure when possible.

After changing the database schema:
- Update AppDbContext.
- Create an EF Core migration.
- Verify the application still builds.


## 17. Build & Verification

After implementing a batch:

1. Build the backend if backend code was changed.
2. Build the frontend if frontend code was changed.
3. Check API contracts.
4. Check that existing APIs still work.
5. Report created/modified files.
6. Report any unresolved issue.

Do not hide build errors.


## 18. Change Minimization

Prefer the smallest change that satisfies the requirement.

Do not:
- Refactor unrelated code.
- Rename existing working files without reason.
- Replace working libraries.
- Rewrite existing components unnecessarily.