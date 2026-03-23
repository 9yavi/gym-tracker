from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.membership_sport import MembershipSport
from models.membership import Membership
from models.sport import Sport
from schemas.membership_sport import MembershipSportCreate, MembershipSportOut

router = APIRouter()


@router.get("/", response_model=list[MembershipSportOut])
def get_membership_sports(db: Session = Depends(get_db)):
    return db.query(MembershipSport).all()


@router.post("/", response_model=MembershipSportOut)
def create_membership_sport(data: MembershipSportCreate, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == data.membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    sport = db.query(Sport).filter(Sport.sport_id == data.sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    existing = db.query(MembershipSport).filter(
        MembershipSport.membership_id == data.membership_id,
        MembershipSport.sport_id == data.sport_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="MembershipSport already exists")

    new_membership_sport = MembershipSport(
        membership_id=data.membership_id,
        sport_id=data.sport_id,
        enrollment_status=data.enrollment_status
    )

    db.add(new_membership_sport)
    db.commit()
    db.refresh(new_membership_sport)
    return new_membership_sport