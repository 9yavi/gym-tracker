from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.workout_log import WorkoutLog
from models.membership import Membership
from models.workout import Workout
from schemas.workout_log import WorkoutLogCreate, WorkoutLogOut
from services.streak_service import update_streak_after_log
from services.ranking_service import update_ranking_after_log
router = APIRouter()


@router.post("/", response_model=WorkoutLogOut)
def create_workout_log(log: WorkoutLogCreate, db: Session = Depends(get_db)):

    membership = db.query(Membership).filter(
        Membership.membership_id == log.membership_id
    ).first()

    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    workout = db.query(Workout).filter(
        Workout.workout_id == log.workout_id
    ).first()

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    new_log = WorkoutLog(
        membership_id=log.membership_id,
        workout_id=log.workout_id,
        log_date=log.log_date,
        duration_minutes=log.duration_minutes,
        calories_burned=log.calories_burned,
        notes=log.notes,
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    update_streak_after_log(
    db=db,
    membership_id=log.membership_id,
    workout_id=log.workout_id,
    log_date=log.log_date
)
    update_ranking_after_log(
    db=db,
    membership_id=log.membership_id,
    workout_id=log.workout_id,
    log_date=log.log_date
)
    return new_log


@router.get("/", response_model=list[WorkoutLogOut])
def get_workout_logs(db: Session = Depends(get_db)):
    return db.query(WorkoutLog).all()