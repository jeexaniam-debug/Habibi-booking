from fastapi import APIRouter, Depends

from ..database.models import User
from ..core.dependencies import require_admin


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(require_admin)
):
    return {
        "message": "Admin access granted",
        "user": current_user.name,
        "role": current_user.role
    }