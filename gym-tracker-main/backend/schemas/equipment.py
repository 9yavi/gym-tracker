from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime


class EquipmentCreate(BaseModel):
    branch_id: int
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    quantity: int = Field(default=1, ge=1)
    condition: Literal["good", "fair", "poor", "out_of_service"] = "good"


class EquipmentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    quantity: int | None = Field(default=None, ge=1)
    condition: Literal["good", "fair", "poor", "out_of_service"] | None = None


class EquipmentOut(BaseModel):
    equipment_id: int
    branch_id: int
    name: str
    description: str | None = None
    quantity: int
    condition: str
    created_at: datetime

    class Config:
        from_attributes = True
