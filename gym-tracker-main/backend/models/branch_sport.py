from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class BranchSport(Base):
    __tablename__ = "branch_sports"

    branch_id = Column(Integer, ForeignKey("branches.branch_id", ondelete="CASCADE"), primary_key=True)
    sport_id = Column(Integer, ForeignKey("sports.sport_id", ondelete="CASCADE"), primary_key=True)
    added_at = Column(DateTime, nullable=False, server_default=func.now())

    branch = relationship("Branch", back_populates="branch_sports")
    sport = relationship("Sport", back_populates="branch_sports")