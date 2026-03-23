from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Ranking(Base):
    __tablename__ = "rankings"

    ranking_id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(Integer, ForeignKey("memberships.membership_id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.sport_id", ondelete="CASCADE"), nullable=False)
    period_type = Column(String(20), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    rank_position = Column(Integer, nullable=False)
    ranking_percent = Column(Float, nullable=False)
    score = Column(Float, nullable=False, default=0)
    calculated_at = Column(DateTime, nullable=False, server_default=func.now())

    membership = relationship("Membership", back_populates="rankings")
    sport = relationship("Sport", back_populates="rankings")