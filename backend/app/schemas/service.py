from pydantic import BaseModel


class ServiceCreate(BaseModel):
    name: str
    description: str | None = None
    price: float


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    active: int | None = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    active: int

    class Config:
        from_attributes = True