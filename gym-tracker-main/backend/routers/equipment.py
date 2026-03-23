from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.equipment import Equipment
from models.branch import Branch
from schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut

router = APIRouter()


@router.get("/", response_model=list[EquipmentOut])
def get_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).all()


@router.get("/{equipment_id}", response_model=EquipmentOut)
def get_equipment_by_id(equipment_id: int, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return item


@router.get("/branch/{branch_id}", response_model=list[EquipmentOut])
def get_equipment_by_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return db.query(Equipment).filter(Equipment.branch_id == branch_id).all()


@router.post("/", response_model=EquipmentOut)
def create_equipment(data: EquipmentCreate, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.branch_id == data.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    item = Equipment(
        branch_id=data.branch_id,
        name=data.name,
        description=data.description,
        quantity=data.quantity,
        condition=data.condition,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{equipment_id}", response_model=EquipmentOut)
def update_equipment(equipment_id: int, data: EquipmentUpdate, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")

    if data.name is not None:
        item.name = data.name
    if data.description is not None:
        item.description = data.description
    if data.quantity is not None:
        item.quantity = data.quantity
    if data.condition is not None:
        item.condition = data.condition

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{equipment_id}")
def delete_equipment(equipment_id: int, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")

    db.delete(item)
    db.commit()
    return {"message": "Equipment deleted successfully"}
