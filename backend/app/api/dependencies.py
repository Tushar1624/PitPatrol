from functools import lru_cache

from app.ai.gemini_detector import GeminiDetector
from app.services.detection_service import DetectionService


@lru_cache
def get_detection_service() -> DetectionService:
    detector = GeminiDetector()
    return DetectionService(detector=detector)