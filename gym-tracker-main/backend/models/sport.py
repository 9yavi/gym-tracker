from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Sport(Base):
    __tablename__ = "sports"

    sport_id = Column(Integer, primary_key=True, index=True)
    sport_name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    branch_sports = relationship("BranchSport", back_populates="sport", cascade="all, delete-orphan")
    membership_sports = relationship("MembershipSport", back_populates="sport", cascade="all, delete-orphan")
    workouts = relationship("Workout", back_populates="sport", cascade="all, delete-orphan")
    streaks = relationship("Streak", back_populates="sport", cascade="all, delete-orphan")
    rankings = relationship("Ranking", back_populates="sport", cascade="all, delete-orphan")