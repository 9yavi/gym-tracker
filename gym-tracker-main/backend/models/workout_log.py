from sqlalchemy import Column, Integer, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(Integer, ForeignKey("memberships.membership_id", ondelete="CASCADE"), nullable=False)
    workout_id = Column(Integer, ForeignKey("workouts.workout_id", ondelete="CASCADE"), nullable=False)
    log_date = Column(Date, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    calories_burned = Column(Integer, nullable=False, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    membership = relationship("Membership", back_populates="workout_logs")
    workout = relationship("Workout", back_populates="workout_logs")