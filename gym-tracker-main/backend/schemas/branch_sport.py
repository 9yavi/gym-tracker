from pydantic import BaseModel
from datetime import datetime


class BranchSportCreate(BaseModel):
    branch_id: int
    sport_id: int


class BranchSportOut(BaseModel):
    branch_id: int
    sport_id: int
    added_at: datetime

    class Config:
        from_attributes = True