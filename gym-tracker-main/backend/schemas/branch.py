from pydantic import BaseModel
from datetime import time, datetime


class BranchCreate(BaseModel):
    branch_name: str
    city: str
    address: str
    phone: str | None = None
    open_time: time | None = None
    close_time: time | None = None


class BranchOut(BaseModel):
    branch_id: int
    branch_name: str
    city: str
    address: str
    phone: str | None = None
    open_time: time | None = None
    close_time: time | None = None
    created_at: datetime

    class Config:
        from_attributes = True