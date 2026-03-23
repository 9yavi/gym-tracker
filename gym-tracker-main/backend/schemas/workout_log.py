from pydantic import BaseModel, Field
from datetime import date


class WorkoutLogCreate(BaseModel):
    membership_id: int
    workout_id: int
    log_date: date
    duration_minutes: int = Field(..., gt=0)
    calories_burned: int = Field(default=0, ge=0)
    notes: str | None = None


class WorkoutLogOut(BaseModel):
    log_id: int
    membership_id: int
    workout_id: int
    log_date: date
    duration_minutes: int
    calories_burned: int
    notes: str | None = None

    class Config:
        from_attributes = True