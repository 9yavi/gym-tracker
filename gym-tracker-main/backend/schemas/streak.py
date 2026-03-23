from pydantic import BaseModel
from datetime import date, datetime


class StreakCreate(BaseModel):
    membership_id: int
    sport_id: int
    current_streak: int = 0
    longest_streak: int = 0
    last_activity_date: date | None = None


class StreakOut(BaseModel):
    streak_id: int
    membership_id: int
    sport_id: int
    current_streak: int
    longest_streak: int
    last_activity_date: date | None = None
    updated_at: datetime

    class Config:
        from_attributes = True