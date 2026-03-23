from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
from models.sport import Sport
from schemas.sport import SportOut, SportCreate, SportUpdate

router = APIRouter()


@router.get("/", response_model=list[SportOut])
def get_sports(db: Session = Depends(get_db)):
    return db.query(Sport).all()


@router.get("/{sport_id}", response_model=SportOut)
def get_sport(sport_id: int, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.sport_id == sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    return sport


@router.post("/", response_model=SportOut)
def create_sport(sport: SportCreate, db: Session = Depends(get_db)):
    existing = db.query(Sport).filter(Sport.sport_name == sport.sport_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Sport name already exists")

    new_sport = Sport(
        sport_name=sport.sport_name,
        category=sport.category,
        description=sport.description,
    )
    db.add(new_sport)
    try:
        db.commit()
        db.refresh(new_sport)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Sport name already exists")
    return new_sport


@router.put("/{sport_id}", response_model=SportOut)
def update_sport(sport_id: int, data: SportUpdate, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.sport_id == sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    if data.sport_name is not None:
        sport.sport_name = data.sport_name
    if data.category is not None:
        sport.category = data.category
    if data.description is not None:
        sport.description = data.description

    try:
        db.commit()
        db.refresh(sport)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Sport name already exists")
    return sport


@router.delete("/{sport_id}")
def delete_sport(sport_id: int, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.sport_id == sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    db.delete(sport)
    db.commit()
    return {"message": "Sport deleted successfully"}
