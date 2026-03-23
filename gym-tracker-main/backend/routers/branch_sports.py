from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.branch_sport import BranchSport
from models.branch import Branch
from models.sport import Sport
from schemas.branch_sport import BranchSportCreate, BranchSportOut

router = APIRouter()


@router.get("/", response_model=list[BranchSportOut])
def get_branch_sports(db: Session = Depends(get_db)):
    return db.query(BranchSport).all()


@router.post("/", response_model=BranchSportOut)
def create_branch_sport(data: BranchSportCreate, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == data.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    sport = db.query(Sport).filter(Sport.sport_id == data.sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    existing = db.query(BranchSport).filter(
        BranchSport.branch_id == data.branch_id,
        BranchSport.sport_id == data.sport_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="BranchSport already exists")

    new_branch_sport = BranchSport(
        branch_id=data.branch_id,
        sport_id=data.sport_id
    )

    db.add(new_branch_sport)
    db.commit()
    db.refresh(new_branch_sport)
    return new_branch_sport