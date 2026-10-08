from datetime import datetime

from pydantic import BaseModel


class BookingCreate(BaseModel):
    service_id: int
    booking_date: datetime


class BookingResponse(BaseModel):
    id: int
    user_id: int
    customer_name: str
    customer_email: str
    service_id: int
    service_name: str
    service_price: float
    booking_date: datetime
    status: str

    class Config:
        from_attributes = True
class BookingStatusUpdate(BaseModel):
    status: str