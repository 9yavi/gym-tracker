from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func

from models.workout import Workout
from models.workout_log import WorkoutLog
from models.streak import Streak
from models.ranking import Ranking


def update_ranking_after_log(db: Session, membership_id: int, workout_id: int, log_date):
    
    workout = db.query(Workout).filter(Workout.workout_id == workout_id).first()
    if not workout:
        return None

    sport_id = workout.sport_id

   
    total_logs = db.query(WorkoutLog).join(
        Workout, Workout.workout_id == WorkoutLog.workout_id
    ).filter(
        WorkoutLog.membership_id == membership_id,
        Workout.sport_id == sport_id
    ).count()

    
    total_duration = db.query(
        func.coalesce(func.sum(WorkoutLog.duration_minutes), 0)
    ).join(
        Workout, Workout.workout_id == WorkoutLog.workout_id
    ).filter(
        WorkoutLog.membership_id == membership_id,
        Workout.sport_id == sport_id
    ).scalar()

   
    streak = db.query(Streak).filter(
        Streak.membership_id == membership_id,
        Streak.sport_id == sport_id
    ).first()

    current_streak = streak.current_streak if streak else 0

    
    score = total_logs * 10 + total_duration * 0.5 + current_streak * 5

   
    period_type = "all_time"
    period_start = date(log_date.year, 1, 1)
    period_end = log_date

   
    ranking = db.query(Ranking).filter(
        Ranking.membership_id == membership_id,
        Ranking.sport_id == sport_id,
        Ranking.period_type == period_type
    ).first()

    if not ranking:
        ranking = Ranking(
            membership_id=membership_id,
            sport_id=sport_id,
            period_type=period_type,
            period_start=period_start,
            period_end=period_end,
            rank_position=1,
            ranking_percent=100.0,
            score=score
        )
        db.add(ranking)
        db.commit()
        db.refresh(ranking)
    else:
        ranking.period_end = period_end
        ranking.score = score
        db.commit()
        db.refresh(ranking)

   
    rankings = db.query(Ranking).filter(
        Ranking.sport_id == sport_id,
        Ranking.period_type == period_type
    ).order_by(Ranking.score.desc()).all()

    total_members = len(rankings)

    for index, item in enumerate(rankings, start=1):
        item.rank_position = index

     
        if total_members == 1:
            item.ranking_percent = 100.0
        else:
            item.ranking_percent = round(((total_members - index) / (total_members - 1)) * 100, 2)

    db.commit()
    db.refresh(ranking)

    return ranking