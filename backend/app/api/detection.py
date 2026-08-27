from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import get_current_user
from app.schemas.detection import DetectionResponse
from app.services.detection_service import DetectionService
from app.services.image_service import (
    ImageProcessingError,
    process_upload,
)
from app.api.dependencies import get_detection_service


router = APIRouter(
    prefix="/api",
    tags=["detection"],
)

security = HTTPBearer()


@router.post(
    "/detect",
    response_model=DetectionResponse,
)
async def detect_image(
    image: UploadFile = File(...),
    current_user=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    detection_service: DetectionService = Depends(
        get_detection_service
    ),
):
    try:
        processed_image = await process_upload(image)

    except ImageProcessingError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    access_token = credentials.credentials

    try:
        result = detection_service.detect_and_save(
            image=processed_image,
            user_id=str(current_user.id),
            access_token=access_token,
            image_path=image.filename,
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Detection failed. Please try again later.",
        )

    return result