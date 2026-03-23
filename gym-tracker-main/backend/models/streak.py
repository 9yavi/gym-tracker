from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Streak(Base):
    __tablename__ = "streaks"
    __table_args__ = (
        UniqueConstraint("membership_id", "sport_id", name="uq_streak_membership_sport"),
    )

    streak_id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(Integer, ForeignKey("memberships.membership_id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.sport_id", ondelete="CASCADE"), nullable=False)
    current_streak = Column(Integer, nullable=False, default=0)
    longest_streak = Column(Integer, nullable=False, default=0)
    last_activity_date = Column(Date, nullable=True)
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    membership = relationship("Membership", back_populates="streaks")
    sport = relationship("Sport", back_populates="streaks")