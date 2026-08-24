from functools import lru_cache

from app.ai.rfdetr_detector import RFDETRDetector
from app.services.detection_service import DetectionService


@lru_cache
def get_detection_service() -> DetectionService:
    detector = RFDETRDetector()
    return DetectionService(detector=detector)