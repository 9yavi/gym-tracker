from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    gender = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    join_date = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")