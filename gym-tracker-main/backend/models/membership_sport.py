from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class MembershipSport(Base):
    __tablename__ = "membership_sports"

    membership_id = Column(Integer, ForeignKey("memberships.membership_id", ondelete="CASCADE"), primary_key=True)
    sport_id = Column(Integer, ForeignKey("sports.sport_id", ondelete="CASCADE"), primary_key=True)
    enrolled_at = Column(DateTime, nullable=False, server_default=func.now())
    enrollment_status = Column(String(20), nullable=False, default="active")

    membership = relationship("Membership", back_populates="membership_sports")
    sport = relationship("Sport", back_populates="membership_sports")