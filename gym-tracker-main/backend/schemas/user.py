from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    is_active: Optional[bool] = None


class UserOut(BaseModel):
    user_id: int
    username: str
    email: str
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    join_date: date
    is_active: bool

    class Config:
        from_attributes = True
        