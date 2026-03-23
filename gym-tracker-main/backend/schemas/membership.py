from pydantic import BaseModel, field_validator, Field
from typing import Literal
from datetime import date, datetime


class MembershipCreate(BaseModel):
    user_id: int
    branch_id: int
    membership_type: Literal["monthly", "quarterly", "yearly"]
    start_date: date
    end_date: date | None = None
    status: Literal["active", "expired", "suspended"] = "active"

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, v, info):
        if v is not None and "start_date" in info.data and info.data["start_date"]:
            if v < info.data["start_date"]:
                raise ValueError("end_date must be after start_date")
        return v


class MembershipUpdate(BaseModel):
    membership_type: Literal["monthly", "quarterly", "yearly"] | None = None
    end_date: date | None = None
    status: Literal["active", "expired", "suspended"] | None = None


class MembershipOut(BaseModel):
    membership_id: int
    user_id: int
    branch_id: int
    membership_type: str
    start_date: date
    end_date: date | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
