from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import date

from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin
from services.security import hash_password, verify_password

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # تحقق مسبق
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user.username:
        existing_username = db.query(User).filter(User.username == user.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already taken")

    # إنشاء المستخدم
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        full_name=user.full_name,
        phone=user.phone,
        gender=user.gender,
        date_of_birth=user.date_of_birth,
        join_date=date.today(),
        is_active=True
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)

    except IntegrityError as e:
        db.rollback()
        err_str = str(e.orig).lower()

        if "phone" in err_str:
            raise HTTPException(status_code=400, detail="Phone number already registered")
        if "username" in err_str:
            raise HTTPException(status_code=400, detail="Username already taken")
        if "email" in err_str:
            raise HTTPException(status_code=400, detail="Email already registered")

        raise HTTPException(status_code=400, detail="Duplicate data error")

    except Exception as e:
        db.rollback()
        print("REGISTER ERROR:", e)  # للتشخيص
        raise HTTPException(status_code=500, detail="Server error during registration")

    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}
