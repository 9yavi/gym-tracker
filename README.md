# 🏋️ Sports Club Tracking System

A full-stack web application for managing sports activities,
memberships, workouts, and performance tracking.

Built using **FastAPI (Backend)**, **React + Vite (Frontend)**, and
**SQLite (Database)** with strong validation, relational design, and real-world business logic.

------------------------------------------------------------------------

# 🚀 Features

- 🔐 User Authentication (Register / Login)
- 🏋️ Sports and Workouts Management
- 🧾 Membership System
- 📊 Workout Logging
- 🔥 Automatic Streak Tracking
- 🏆 Automatic Ranking & Leaderboard
- 🏋️‍♂️ Equipment Management System ✅ *(NEW)*
- 🔗 Advanced Relationships (Many-to-Many)
- 🧩 Branch ↔ Sport Mapping ✅ *(NEW)*
- 🧩 Membership ↔ Sport Mapping ✅ *(NEW)*
- ✅ Data Validation using Pydantic
- ⚡ Improved Frontend ↔ Backend API Integration

------------------------------------------------------------------------

# 🧠 Technical Highlights

- More than **10+ database entities**
- Advanced relational design with **Many-to-Many relationships**
- Clean architecture:
  - Models (Database Layer)
  - Schemas (Validation Layer)
  - Routers (API Layer)
  - Services (Business Logic Layer)
- Secure password handling using hashing
- Separation of concerns across backend modules
- Scalable structure for future feature expansion

------------------------------------------------------------------------

# 🗄️ Database Design

The system includes multiple interconnected entities:

- Users
- Branches
- Memberships
- Sports
- Workouts
- WorkoutLogs
- Streaks
- Rankings
- Equipment ✅ *(NEW)*
- BranchSports (M:N) ✅ *(NEW)*
- MembershipSports (M:N) ✅ *(NEW)*

------------------------------------------------------------------------

# ⚙️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Passlib (bcrypt)

## Frontend

- React
- Vite

------------------------------------------------------------------------

# 📊 Business Logic

## ⚙️ System Design Notes

Some modules such as Equipment, Branch-Sport, and Membership-Sport relationships
are designed as extensible components within the system architecture.

They are fully integrated at the database and API levels, and can be easily
extended with additional business logic (e.g., usage tracking, access control,
or dynamic assignment rules) in future iterations.

## 🔥 Streak System

- Automatically updated after each workout log
- Tracks:
  - current streak
  - longest streak
- Resets after inactivity

## 🏆 Ranking System

- Automatically calculated based on:
  - number of workouts
  - total duration
  - streak
- Generates leaderboard per sport

## 🏋️‍♂️ Equipment System 

- Manage gym equipment
- Link equipment to workouts
- Designed for future extensions (usage tracking, maintenance)

## 🔗 Relationship Logic 

- Branch ↔ Sport:
  - Each branch can support multiple sports
- Membership ↔ Sport:
  - Each membership grants access to multiple sports
- Enforced using relational tables with proper constraints

------------------------------------------------------------------------

# 📡 API Overview

Main API modules:

- /auth → Register / Login
- /users
- /branches
- /memberships
- /sports
- /workouts
- /workout-logs
- /streaks
- /rankings
- /equipment 
- /branch-sports 
- /membership-sports 

Example:

GET /rankings/sport/{sport_id}  
→ Returns leaderboard for a specific sport.

------------------------------------------------------------------------

# ▶️ How to Run

## Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
