from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Membership(Base):
    __tablename__ = "memberships"

    membership_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.branch_id", ondelete="CASCADE"), nullable=False)
    membership_type = Column(String(20), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="memberships")
    branch = relationship("Branch", back_populates="memberships")
    membership_sports = relationship("MembershipSport", back_populates="membership", cascade="all, delete-orphan")
    workout_logs = relationship("WorkoutLog", back_populates="membership", cascade="all, delete-orphan")
    streaks = relationship("Streak", back_populates="membership", cascade="all, delete-orphan")
    rankings = relationship("Ranking", back_populates="membership", cascade="all, delete-orphan")