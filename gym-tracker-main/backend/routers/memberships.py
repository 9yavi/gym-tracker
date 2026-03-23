from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.membership import Membership
from models.user import User
from models.branch import Branch
from schemas.membership import MembershipCreate, MembershipUpdate, MembershipOut

router = APIRouter()


@router.get("/", response_model=list[MembershipOut])
def get_memberships(db: Session = Depends(get_db)):
    return db.query(Membership).all()


@router.get("/{membership_id}", response_model=MembershipOut)
def get_membership(membership_id: int, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    return membership


@router.get("/user/{user_id}", response_model=list[MembershipOut])
def get_memberships_by_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Membership).filter(Membership.user_id == user_id).all()


@router.post("/", response_model=MembershipOut)
def create_membership(membership: MembershipCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == membership.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    branch = db.query(Branch).filter(Branch.branch_id == membership.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    if membership.end_date and membership.end_date < membership.start_date:
        raise HTTPException(status_code=400, detail="end_date must be after start_date")

    new_membership = Membership(
        user_id=membership.user_id,
        branch_id=membership.branch_id,
        membership_type=membership.membership_type,
        start_date=membership.start_date,
        end_date=membership.end_date,
        status=membership.status,
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)
    return new_membership


@router.put("/{membership_id}", response_model=MembershipOut)
def update_membership(membership_id: int, data: MembershipUpdate, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    if data.membership_type is not None:
        membership.membership_type = data.membership_type
    if data.end_date is not None:
        if data.end_date < membership.start_date:
            raise HTTPException(status_code=400, detail="end_date must be after start_date")
        membership.end_date = data.end_date
    if data.status is not None:
        membership.status = data.status

    db.commit()
    db.refresh(membership)
    return membership


@router.delete("/{membership_id}")
def delete_membership(membership_id: int, db: Session = Depends(get_db)):
    membership = db.query(Membership).filter(Membership.membership_id == membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    db.delete(membership)
    db.commit()
    return {"message": "Membership deleted successfully"}
