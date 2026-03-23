import logging
from fastapi import FastAPI
from database import engine, Base, DB_PATH

from models.user import User
from models.branch import Branch
from models.membership import Membership
from models.sport import Sport
from models.branch_sport import BranchSport
from models.membership_sport import MembershipSport
from models.workout import Workout
from models.workout_log import WorkoutLog
from models.streak import Streak
from models.ranking import Ranking
from models.equipment import Equipment

from routers import auth
from routers import sports
from routers import workouts
from routers import workout_logs
from routers import users
from routers import branches
from routers import memberships
from routers import branch_sports
from routers import membership_sports
from routers import streaks
from routers import rankings
from routers import equipment

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Gym Tracker API",
    description="Full-featured gym management system — users, memberships, branches, workouts, streaks and rankings.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(branches.router, prefix="/branches", tags=["Branches"])
app.include_router(memberships.router, prefix="/memberships", tags=["Memberships"])
app.include_router(sports.router, prefix="/sports", tags=["Sports"])
app.include_router(workouts.router, prefix="/workouts", tags=["Workouts"])
app.include_router(workout_logs.router, prefix="/workout-logs", tags=["Workout Logs"])
app.include_router(branch_sports.router, prefix="/branch-sports", tags=["Branch Sports"])
app.include_router(membership_sports.router, prefix="/membership-sports", tags=["Membership Sports"])
app.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])
app.include_router(streaks.router, prefix="/streaks", tags=["Streaks"])
app.include_router(rankings.router, prefix="/rankings", tags=["Rankings"])

Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"=== DATABASE PATH: {DB_PATH} ===")


@app.get("/")
def root():
    return {"message": "Gym Tracker API is running", "docs": "/docs"}
