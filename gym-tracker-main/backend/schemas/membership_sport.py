from pydantic import BaseModel
from datetime import datetime


class MembershipSportCreate(BaseModel):
    membership_id: int
    sport_id: int
    enrollment_status: str = "active"


class MembershipSportOut(BaseModel):
    membership_id: int
    sport_id: int
    enrolled_at: datetime
    enrollment_status: str

    class Config:
        from_attributes = True