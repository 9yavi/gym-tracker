from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.ranking import Ranking
from models.membership import Membership
from models.sport import Sport
from schemas.ranking import RankingCreate, RankingOut

router = APIRouter()


@router.get("/", response_model=list[RankingOut])
def get_rankings(db: Session = Depends(get_db)):
    return db.query(Ranking).all()


@router.post("/", response_model=RankingOut)
def create_ranking(data: RankingCreate, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == data.membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    sport = db.query(Sport).filter(Sport.sport_id == data.sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    new_ranking = Ranking(
        membership_id=data.membership_id,
        sport_id=data.sport_id,
        period_type=data.period_type,
        period_start=data.period_start,
        period_end=data.period_end,
        rank_position=data.rank_position,
        ranking_percent=data.ranking_percent,
        score=data.score
    )

    db.add(new_ranking)
    db.commit()
    db.refresh(new_ranking)
    return new_ranking
@router.get("/sport/{sport_id}", response_model=list[RankingOut])
def get_rankings_by_sport(sport_id: int, db: Session = Depends(get_db)):
    rankings = db.query(Ranking).filter(
        Ranking.sport_id == sport_id
    ).order_by(Ranking.rank_position.asc()).all()

    return rankings