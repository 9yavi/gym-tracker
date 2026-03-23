from datetime import timedelta
from sqlalchemy.orm import Session

from models.streak import Streak
from models.workout import Workout


def update_streak_after_log(db: Session, membership_id: int, workout_id: int, log_date):
   
    workout = db.query(Workout).filter(Workout.workout_id == workout_id).first()
    if not workout:
        return None

    sport_id = workout.sport_id


    streak = db.query(Streak).filter(
        Streak.membership_id == membership_id,
        Streak.sport_id == sport_id
    ).first()

    
    if not streak:
        streak = Streak(
            membership_id=membership_id,
            sport_id=sport_id,
            current_streak=1,
            longest_streak=1,
            last_activity_date=log_date
        )
        db.add(streak)
        db.commit()
        db.refresh(streak)
        return streak

    if streak.last_activity_date == log_date:
        return streak

    if streak.last_activity_date and streak.last_activity_date == (log_date - timedelta(days=1)):
        streak.current_streak += 1
    else:
        
        streak.current_streak = 1

    #
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_activity_date = log_date

    db.commit()
    db.refresh(streak)
    return streak