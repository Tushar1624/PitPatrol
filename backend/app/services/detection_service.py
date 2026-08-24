from typing import Any

from PIL import Image

from app.ai.detector import Detector
from app.schemas.detection import DetectionResponse
from app.services.detection_repository import DetectionRepository


class DetectionService:
    def __init__(
        self,
        detector: Detector,
        repository: DetectionRepository | None = None,
    ):
        self.detector = detector
        self.repository = repository

    def detect(self, image: Image.Image) -> DetectionResponse:
        return self.detector.detect(image)

    def detect_and_save(
        self,
        image: Image.Image,
        user_id: str,
        access_token: str,
        image_path: str | None = None,
    ) -> DetectionResponse:
        result = self.detector.detect(image)

        if self.repository is None:
            self.repository = DetectionRepository(access_token)

        detections: list[dict[str, Any]] = [
            detection.model_dump()
            for detection in result.detections
        ]

        self.repository.create_detection(
            user_id=user_id,
            image_path=image_path,
            detection_count=result.detection_count,
            detections=detections,
        )

        return result