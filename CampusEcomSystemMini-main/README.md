# CampusEcomSystemMini

CampusEcomSystemMini is a campus utility platform designed to help students connect, exchange information, find study groups, manage lost and found items, communicate, and participate in campus activities.

## Main Features

### 1. Authentication & User Profile
- Register / Login
- JWT Authentication
- User Profile
- Role-based access

### 2. Smart Matching
- Study group matching
- Rental matching

### 3. Lost & Found
- Create lost/found posts
- Location information
- Owner verification
- Messenger interaction

### 4. Academic Library & Exchange
- Upload and manage documents
- Book/document exchange

### 5. Messenger & Notification
- User-to-user messaging
- Notifications

### 6. Gamification & Admin Hub
- Points
- Leaderboard
- Reports
- Admin management


  ## Technology Stack

### Backend
- C#
- ASP.NET Core
- Entity Framework Core
- SQL Server
- JWT
- Clean Architecture

### Frontend
- React
- Vite

### Tools
- Git / GitHub
- Visual Studio Code
- Docker

  ## System Architecture

The backend follows Clean Architecture:

API
 ↓
Application
 ↓
Domain
 ↑
Infrastructure

## Project Structure

CampusEcomSystemMini
├── API
├── Application
├── Domain
├── Infrastructure
└── Web

## Installation & Setup

### Clone repository

git clone <repository-url>

### Backend

cd CampusEcomSystemMini
dotnet restore
dotnet build

### Database

Update the SQL Server connection string in appsettings.json.

Run Entity Framework migrations:

dotnet ef database update

## How to Run

### Backend

dotnet run

### Frontend

npm install
npm run dev

## How to Use

### Student

1. Register an account.
2. Login to the system.
3. Create and manage personal posts.
4. Search for study groups or rental opportunities.
5. Create or search for lost and found items.
6. Exchange documents or books.
7. Send messages to other users.
8. Receive notifications.
9. Earn points and view the leaderboard.

### Admin

1. Login with an administrator account.
2. Manage users.
3. Manage posts.
4. Review reports.
5. Manage leaderboard and gamification data.

