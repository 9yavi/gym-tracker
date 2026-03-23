from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    equipment_id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.branch_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    condition = Column(String(20), nullable=False, default="good")
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    branch = relationship("Branch", back_populates="equipment")
