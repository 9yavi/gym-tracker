from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.streak import Streak
from models.membership import Membership
from models.sport import Sport
from schemas.streak import StreakCreate, StreakOut

router = APIRouter()


@router.get("/", response_model=list[StreakOut])
def get_streaks(db: Session = Depends(get_db)):
    return db.query(Streak).all()


@router.post("/", response_model=StreakOut)
def create_streak(data: StreakCreate, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == data.membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    sport = db.query(Sport).filter(Sport.sport_id == data.sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    existing = db.query(Streak).filter(
        Streak.membership_id == data.membership_id,
        Streak.sport_id == data.sport_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Streak already exists for this membership and sport")

    new_streak = Streak(
        membership_id=data.membership_id,
        sport_id=data.sport_id,
        current_streak=data.current_streak,
        longest_streak=data.longest_streak,
        last_activity_date=data.last_activity_date
    )

    db.add(new_streak)
    db.commit()
    db.refresh(new_streak)
    return new_streak