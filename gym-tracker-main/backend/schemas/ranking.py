from pydantic import BaseModel, Field
from datetime import date, datetime


class RankingCreate(BaseModel):
    membership_id: int
    sport_id: int
    period_type: str
    period_start: date
    period_end: date
    rank_position: int = Field(..., gt=0)
    ranking_percent: float = Field(..., ge=0, le=100)
    score: float = Field(default=0, ge=0)


class RankingOut(BaseModel):
    ranking_id: int
    membership_id: int
    sport_id: int
    period_type: str
    period_start: date
    period_end: date
    rank_position: int
    ranking_percent: float
    score: float
    calculated_at: datetime

    class Config:
        from_attributes = True