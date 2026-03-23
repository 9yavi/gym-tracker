from pydantic import BaseModel, Field


class SportOut(BaseModel):
    sport_id: int
    sport_name: str
    category: str
    description: str | None = None

    class Config:
        from_attributes = True


class SportCreate(BaseModel):
    sport_name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    description: str | None = None


class SportUpdate(BaseModel):
    sport_name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
