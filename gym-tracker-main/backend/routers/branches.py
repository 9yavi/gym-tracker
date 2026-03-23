from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
from models.branch import Branch
from schemas.branch import BranchCreate, BranchOut

router = APIRouter()


@router.get("/", response_model=list[BranchOut])
def get_branches(db: Session = Depends(get_db)):
    return db.query(Branch).all()


@router.get("/{branch_id}", response_model=BranchOut)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch


@router.post("/", response_model=BranchOut)
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    existing = db.query(Branch).filter(Branch.branch_name == branch.branch_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Branch name already exists")

    new_branch = Branch(
        branch_name=branch.branch_name,
        city=branch.city,
        address=branch.address,
        phone=branch.phone,
        open_time=branch.open_time,
        close_time=branch.close_time,
    )
    db.add(new_branch)
    try:
        db.commit()
        db.refresh(new_branch)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Branch name already exists")
    return new_branch


@router.put("/{branch_id}", response_model=BranchOut)
def update_branch(branch_id: int, data: BranchCreate, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    branch.branch_name = data.branch_name
    branch.city = data.city
    branch.address = data.address
    branch.phone = data.phone
    branch.open_time = data.open_time
    branch.close_time = data.close_time

    try:
        db.commit()
        db.refresh(branch)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Branch name already exists")
    return branch


@router.delete("/{branch_id}")
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    db.delete(branch)
    db.commit()
    return {"message": "Branch deleted successfully"}
