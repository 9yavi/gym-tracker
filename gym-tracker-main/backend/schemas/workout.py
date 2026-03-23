from pydantic import BaseModel, Field, field_validator
from typing import Literal


class WorkoutOut(BaseModel):
    workout_id: int
    sport_id: int
    workout_name: str
    difficulty_level: str
    estimated_duration_minutes: int | None = None
    description: str | None = None

    class Config:
        from_attributes = True


class WorkoutCreate(BaseModel):
    sport_id: int
    workout_name: str = Field(..., min_length=1, max_length=100)
    difficulty_level: Literal["beginner", "intermediate", "hard"]
    estimated_duration_minutes: int | None = Field(default=None, gt=0, le=300)
    description: str | None = None


class WorkoutUpdate(BaseModel):
    workout_name: str | None = Field(default=None, min_length=1, max_length=100)
    difficulty_level: Literal["beginner", "intermediate", "hard"] | None = None
    estimated_duration_minutes: int | None = Field(default=None, gt=0, le=300)
    description: str | None = None
