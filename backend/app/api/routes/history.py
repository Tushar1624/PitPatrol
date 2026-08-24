from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import get_current_user
from app.core.supabase import get_authenticated_client
from app.services.history_service import HistoryService

router = APIRouter(prefix="/api", tags=["History"])

security = HTTPBearer()


@router.get("/history")
async def get_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user=Depends(get_current_user),
):
    client = get_authenticated_client(credentials.credentials)

    items = HistoryService.get_history(client)

    return {
        "items": items
    }


@router.get("/history/{detection_id}")
async def get_history_by_id(
    detection_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user=Depends(get_current_user),
):
    client = get_authenticated_client(credentials.credentials)

    detection = HistoryService.get_history_by_id(
        client,
        detection_id,
    )

    if detection is None:
        raise HTTPException(
            status_code=404,
            detail="Detection record not found",
        )

    return detection