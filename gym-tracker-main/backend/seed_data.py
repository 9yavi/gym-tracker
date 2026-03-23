from datetime import date, time
from database import SessionLocal
from models.user import User
from models.branch import Branch
from models.membership import Membership
from models.sport import Sport
from models.workout import Workout
from models.branch_sport import BranchSport
from models.membership_sport import MembershipSport
from models.workout_log import WorkoutLog
from models.streak import Streak
from models.ranking import Ranking

def seed_data():
    db = SessionLocal()

    try:
    
        if db.query(User).first():
            print("Database already has data. Skipping seed.")
            return

        # Users
        user1 = User(
            username="ahmad_h",
            email="ahmad@example.com",
            password_hash="pass123",
            full_name="Ahmad Hassan",
            phone="0501111111",
            gender="male",
            date_of_birth=date(1998, 5, 10),
            join_date=date(2024, 1, 15),
            is_active=True
        )

        user2 = User(
            username="sara_k",
            email="sara@example.com",
            password_hash="pass123",
            full_name="Sara Khaled",
            phone="0502222222",
            gender="female",
            date_of_birth=date(2000, 3, 22),
            join_date=date(2024, 2, 1),
            is_active=True
        )

        db.add_all([user1, user2])
        db.commit()

        # Branches
        branch1 = Branch(
            branch_name="Main Branch",
            city="Istanbul",
            address="Basaksehir, Istanbul",
            phone="0212000000",
            open_time=time(8, 0),
            close_time=time(22, 0)
        )

        branch2 = Branch(
            branch_name="Second Branch",
            city="Istanbul",
            address="Kayasehir, Istanbul",
            phone="0212111111",
            open_time=time(9, 0),
            close_time=time(23, 0)
        )

        db.add_all([branch1, branch2])
        db.commit()

        # Memberships
        membership1 = Membership(
            user_id=user1.user_id,
            branch_id=branch1.branch_id,
            membership_type="monthly",
            start_date=date(2025, 1, 1),
            end_date=date(2025, 2, 1),
            status="active"
        )

        membership2 = Membership(
            user_id=user2.user_id,
            branch_id=branch2.branch_id,
            membership_type="yearly",
            start_date=date(2025, 1, 1),
            end_date=date(2026, 1, 1),
            status="active"
        )

        db.add_all([membership1, membership2])
        db.commit()

        # Sports
        sport1 = Sport(
            sport_name="Gym",
            category="Fitness",
            description="Weight training and resistance workouts"
        )

        sport2 = Sport(
            sport_name="Tennis",
            category="Racket Sport",
            description="Indoor and outdoor tennis practice"
        )

        db.add_all([sport1, sport2])
        db.commit()

        # Workouts
        workout1 = Workout(
            sport_id=sport1.sport_id,
            workout_name="Chest Day",
            difficulty_level="beginner",
            estimated_duration_minutes=60,
            description="Basic chest workout"
        )

        workout2 = Workout(
            sport_id=sport1.sport_id,
            workout_name="Leg Day",
            difficulty_level="intermediate",
            estimated_duration_minutes=75,
            description="Strength-focused leg training"
        )

        workout3 = Workout(
            sport_id=sport2.sport_id,
            workout_name="Forehand Practice",
            difficulty_level="beginner",
            estimated_duration_minutes=45,
            description="Forehand repetition and control"
        )

        db.add_all([workout1, workout2, workout3])
        db.commit()

        print("Seed data inserted successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()