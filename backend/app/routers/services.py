
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Service, User
from ..schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse
)
from ..core.dependencies import require_admin
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/api/services",
    tags=["Services"]
)


# =========================
# CREATE SERVICE
# ADMIN ONLY
# =========================

@router.post(
    "/",
    response_model=ServiceResponse
)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    new_service = Service(
        name=service.name,
        description=service.description,
        price=service.price
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service


# =========================
# GET SERVICES
# PUBLIC
# =========================

@router.get(
    "/",
    response_model=list[ServiceResponse]
)
def get_services(
    db: Session = Depends(get_db)
):
    services = db.query(Service).all()

    return services
@router.put(
    "/{service_id}",
    response_model=ServiceResponse
)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    if service_data.name is not None:
        service.name = service_data.name

    if service_data.description is not None:
        service.description = service_data.description

    if service_data.price is not None:
        service.price = service_data.price

    if service_data.active is not None:
        service.active = service_data.active

    db.commit()
    db.refresh(service)

    return service