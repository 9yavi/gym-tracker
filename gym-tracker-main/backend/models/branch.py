from sqlalchemy import Column, Integer, String, DateTime, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Branch(Base):
    __tablename__ = "branches"

    branch_id = Column(Integer, primary_key=True, index=True)
    branch_name = Column(String(100), nullable=False, unique=True, index=True)
    city = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    open_time = Column(Time, nullable=True)
    close_time = Column(Time, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    memberships = relationship("Membership", back_populates="branch", cascade="all, delete-orphan")
    branch_sports = relationship("BranchSport", back_populates="branch", cascade="all, delete-orphan")
    equipment = relationship("Equipment", back_populates="branch", cascade="all, delete-orphan")