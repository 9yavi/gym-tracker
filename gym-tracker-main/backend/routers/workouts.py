from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.workout import Workout
from models.sport import Sport
from schemas.workout import WorkoutOut, WorkoutCreate, WorkoutUpdate

router = APIRouter()

VALID_DIFFICULTIES = {"beginner", "intermediate", "hard"}


@router.get("/", response_model=list[WorkoutOut])
def get_workouts(db: Session = Depends(get_db)):
    return db.query(Workout).all()


@router.get("/{workout_id}", response_model=WorkoutOut)
def get_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.workout_id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.post("/", response_model=WorkoutOut)
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.sport_id == workout.sport_id).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")

    new_workout = Workout(
        sport_id=workout.sport_id,
        workout_name=workout.workout_name,
        difficulty_level=workout.difficulty_level,
        estimated_duration_minutes=workout.estimated_duration_minutes,
        description=workout.description,
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout


@router.put("/{workout_id}", response_model=WorkoutOut)
def update_workout(workout_id: int, data: WorkoutUpdate, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.workout_id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    if data.workout_name is not None:
        workout.workout_name = data.workout_name
    if data.difficulty_level is not None:
        workout.difficulty_level = data.difficulty_level
    if data.estimated_duration_minutes is not None:
        workout.estimated_duration_minutes = data.estimated_duration_minutes
    if data.description is not None:
        workout.description = data.description

    db.commit()
    db.refresh(workout)
    return workout


@router.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(Workout).filter(Workout.workout_id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted successfully"}
