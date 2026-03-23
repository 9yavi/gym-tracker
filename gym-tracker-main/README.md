# 🏋️ Sports Club Tracking System

A full-stack web application for managing sports activities,
memberships, workouts, and performance tracking.

Built using **FastAPI (Backend)**, **React + Vite (Frontend)**, and
**SQLite (Database)** with strong validation and business logic.

------------------------------------------------------------------------

# 🚀 Features

-   🔐 User Authentication (Register / Login)
-   🏋️ Sports and Workouts Management
-   🧾 Membership System
-   📊 Workout Logging
-   🔥 Automatic Streak Tracking
-   🏆 Automatic Ranking & Leaderboard
-   🔗 Advanced Relationships (Many-to-Many)
-   ✅ Data Validation using Pydantic

------------------------------------------------------------------------

# 🧠 Technical Highlights

-   More than **10 database entities**
-   Advanced relationships:
    -   Branch ↔ Sport (Many-to-Many)
    -   Membership ↔ Sport (Many-to-Many)
-   Clean architecture:
    -   Models (Database)
    -   Schemas (Validation)
    -   Routers (API)
    -   Services (Business Logic)
-   Secure password handling using **bcrypt hashing**
-   Automatic:
    -   Streak updates based on activity
    -   Ranking calculations based on performance

------------------------------------------------------------------------

# 🗄️ Database Design

The system includes multiple interconnected entities:

-   Users
-   Branches
-   Memberships
-   Sports
-   Workouts
-   WorkoutLogs
-   Streaks
-   Rankings
-   BranchSports (M:N)
-   MembershipSports (M:N)

------------------------------------------------------------------------

# ⚙️ Tech Stack

## Backend

-   FastAPI
-   SQLAlchemy
-   Pydantic
-   SQLite
-   Passlib (bcrypt)

## Frontend

-   React
-   Vite

------------------------------------------------------------------------

# 📊 Business Logic

## 🔥 Streak System

-   Automatically updated after each workout log
-   Tracks:
    -   current streak
    -   longest streak
-   Resets after inactivity

## 🏆 Ranking System

-   Automatically calculated based on:
    -   number of workouts
    -   total duration
    -   streak
-   Generates leaderboard per sport

------------------------------------------------------------------------

# 📡 API Overview

Main API modules:

-   /auth → Register / Login
-   /users
-   /branches
-   /memberships
-   /sports
-   /workouts
-   /workout-logs
-   /streaks
-   /rankings

Example: GET /rankings/sport/{sport_id} Returns leaderboard for a
specific sport.

------------------------------------------------------------------------

# ▶️ How to Run

## Backend

cd backend python -m venv venv venv`\Scripts`{=tex}`\activate`{=tex} pip
install -r requirements.txt python -m uvicorn main:app --reload

Open: http://127.0.0.1:8000/docs

------------------------------------------------------------------------

## Frontend

cd frontend npm install npm run dev

------------------------------------------------------------------------

# 📸 Screenshots

Screenshots are available in the /screenshots folder.

------------------------------------------------------------------------

# 🧪 Example Flow

1.  Register a user
2.  Login
3.  Create sport
4.  Create workout
5.  Create membership
6.  Log workouts
7.  System updates streak and ranking
8.  View leaderboard

------------------------------------------------------------------------

# 👨‍💻 Contributors

-   Backend Development
-   Database Design
-   Frontend Development

------------------------------------------------------------------------

# 🎯 Project Goal

To build a robust and scalable sports tracking system with real-world
business logic.
