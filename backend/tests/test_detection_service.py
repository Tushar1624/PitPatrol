from PIL import Image
from unittest.mock import MagicMock
from app.schemas.detection import (
    BoundingBox,
    Detection,
    DetectionResponse,
)
from app.services.detection_service import DetectionService


class MockDetector:
    def detect(self, image: Image.Image) -> DetectionResponse:
        return DetectionResponse(
            detections=[
                Detection(
                    class_name="pothole",
                    confidence=0.95,
                    bbox=BoundingBox(
                        x1=10,
                        y1=20,
                        x2=100,
                        y2=120,
                    ),
                )
            ],
            detection_count=1,
        )


def test_detection_service():
    detector = MockDetector()
    service = DetectionService(detector)

    image = Image.new(
        "RGB",
        (640, 480),
        "white",
    )

    result = service.detect(image)

    assert result.detection_count == 1
    assert len(result.detections) == 1

    detection = result.detections[0]

    assert detection.class_name == "pothole"
    assert detection.confidence == 0.95
    assert detection.bbox.x1 == 10
    assert detection.bbox.y1 == 20
    assert detection.bbox.x2 == 100
    assert detection.bbox.y2 == 120

def test_detection_service_saves_result():
    detector = MockDetector()

    repository = MagicMock()

    service = DetectionService(
        detector=detector,
        repository=repository,
    )

    image = Image.new(
        "RGB",
        (640, 480),
        "white",
    )

    result = service.detect_and_save(
        image=image,
        user_id="test-user",
        access_token="test-token",
        image_path="uploads/test.jpg",
    )

    assert result.detection_count == 1

    repository.create_detection.assert_called_once()

    call_kwargs = (
        repository.create_detection.call_args.kwargs
    )

    assert call_kwargs["user_id"] == "test-user"
    assert call_kwargs["image_path"] == "uploads/test.jpg"
    assert call_kwargs["detection_count"] == 1

    assert call_kwargs["detections"] == [
        {
            "class_name": "pothole",
            "confidence": 0.95,
            "bbox": {
                "x1": 10,
                "y1": 20,
                "x2": 100,
                "y2": 120,
            },
        }
    ]