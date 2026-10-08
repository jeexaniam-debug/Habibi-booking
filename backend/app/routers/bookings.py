from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Booking, Service, User
from ..schemas.booking import (
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate
)
from ..core.dependencies import require_customer, require_admin


router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


# ============================================================
# CUSTOMER — CREATE BOOKING
# ============================================================

@router.post(
    "/",
    response_model=BookingResponse
)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    service = (
        db.query(Service)
        .filter(Service.id == booking_data.service_id)
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    if service.active != 1:
        raise HTTPException(
            status_code=400,
            detail="Service is not available"
        )

    new_booking = Booking(
        user_id=current_user.id,
        service_id=booking_data.service_id,
        booking_date=booking_data.booking_date,
        status="PENDING"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return {
        "id": new_booking.id,
        "user_id": current_user.id,
        "customer_name": current_user.name,
        "customer_email": current_user.email,
        "service_id": service.id,
        "service_name": service.name,
        "service_price": service.price,
        "booking_date": new_booking.booking_date,
        "status": new_booking.status
    }


# ============================================================
# CUSTOMER — VIEW MY BOOKINGS
# ============================================================

@router.get(
    "/my",
    response_model=list[BookingResponse]
)
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer)
):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .all()
    )

    result = []

    for booking in bookings:
        service = (
            db.query(Service)
            .filter(Service.id == booking.service_id)
            .first()
        )

        if not service:
            continue

        result.append({
            "id": booking.id,
            "user_id": booking.user_id,
            "customer_name": current_user.name,
            "customer_email": current_user.email,
            "service_id": booking.service_id,
            "service_name": service.name,
            "service_price": service.price,
            "booking_date": booking.booking_date,
            "status": booking.status
        })

    return result


# ============================================================
# ADMIN — VIEW ALL BOOKINGS
# ============================================================

@router.get(
    "/all",
    response_model=list[BookingResponse]
)
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    bookings = db.query(Booking).all()

    result = []

    for booking in bookings:
        customer = (
            db.query(User)
            .filter(User.id == booking.user_id)
            .first()
        )

        service = (
            db.query(Service)
            .filter(Service.id == booking.service_id)
            .first()
        )

        if not customer or not service:
            continue

        result.append({
            "id": booking.id,
            "user_id": booking.user_id,
            "customer_name": customer.name,
            "customer_email": customer.email,
            "service_id": booking.service_id,
            "service_name": service.name,
            "service_price": service.price,
            "booking_date": booking.booking_date,
            "status": booking.status
        })

    return result


# ============================================================
# ADMIN — UPDATE BOOKING STATUS
# ============================================================

@router.put(
    "/{booking_id}/status",
    response_model=BookingResponse
)
def update_booking_status(
    booking_id: int,
    status_data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    allowed_transitions = {
        "PENDING": {
            "CONFIRMED",
            "REJECTED"
        },
        "CONFIRMED": {
            "IN_PROGRESS"
        },
        "IN_PROGRESS": {
            "COMPLETED"
        },
        "COMPLETED": set(),
        "REJECTED": set()
    }

    current_status = booking.status
    new_status = status_data.status

    if new_status not in allowed_transitions:
        raise HTTPException(
            status_code=400,
            detail="Invalid booking status"
        )

    if new_status not in allowed_transitions[current_status]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot change booking "
                f"from {current_status} to {new_status}"
            )
        )

    booking.status = new_status

    db.commit()
    db.refresh(booking)

    customer = (
        db.query(User)
        .filter(User.id == booking.user_id)
        .first()
    )

    service = (
        db.query(Service)
        .filter(Service.id == booking.service_id)
        .first()
    )

    return {
        "id": booking.id,
        "user_id": booking.user_id,
        "customer_name": customer.name,
        "customer_email": customer.email,
        "service_id": booking.service_id,
        "service_name": service.name,
        "service_price": service.price,
        "booking_date": booking.booking_date,
        "status": booking.status
    }