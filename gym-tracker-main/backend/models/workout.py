from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Workout(Base):
    __tablename__ = "workouts"

    workout_id = Column(Integer, primary_key=True, index=True)
    sport_id = Column(Integer, ForeignKey("sports.sport_id", ondelete="CASCADE"), nullable=False)
    workout_name = Column(String(100), nullable=False)
    difficulty_level = Column(String(20), nullable=False)
    estimated_duration_minutes = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    sport = relationship("Sport", back_populates="workouts")
    workout_logs = relationship("WorkoutLog", back_populates="workout", cascade="all, delete-orphan")