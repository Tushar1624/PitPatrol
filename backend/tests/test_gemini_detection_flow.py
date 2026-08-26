from io import BytesIO
from types import SimpleNamespace
from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from PIL import Image

from app.ai.gemini_detector import GeminiDetector
from app.api.dependencies import get_detection_service
from app.core.auth import get_current_user
from app.main import app
from app.schemas.detection import (
    BoundingBox,
    Detection,
    DetectionResponse,
)
from app.services.detection_service import DetectionService


client = TestClient(app)


def create_test_image():
    image = Image.new(
        "RGB",
        (100, 100),
        "white",
    )

    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)

    return buffer


def create_gemini_result():
    return DetectionResponse(
        detections=[
            Detection(
                class_name="pothole",
                confidence=0.95,
                bbox=BoundingBox(
                    x1=10.0,
                    y1=20.0,
                    x2=80.0,
                    y2=90.0,
                ),
            )
        ],
        detection_count=1,
    )


def test_detect_api_complete_gemini_database_flow():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    # Mock Gemini detector.
    mock_gemini = MagicMock(
        spec=GeminiDetector
    )

    mock_gemini.detect.return_value = (
        create_gemini_result()
    )

    # Mock database repository.
    mock_repository = MagicMock()

    # Use the real DetectionService.
    service = DetectionService(
        detector=mock_gemini,
        repository=mock_repository,
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )

    app.dependency_overrides[get_detection_service] = (
        lambda: service
    )

    try:
        response = client.post(
            "/api/detect",
            headers={
                "Authorization": "Bearer test-access-token",
            },
            files={
                "image": (
                    "road.jpg",
                    create_test_image(),
                    "image/jpeg",
                )
            },
        )

        assert response.status_code == 200

        body = response.json()

        # Verify API response.
        assert body["detection_count"] == 1
        assert len(body["detections"]) == 1

        detection = body["detections"][0]

        assert detection["class_name"] == "pothole"
        assert detection["confidence"] == 0.95

        assert detection["bbox"]["x1"] == 10.0
        assert detection["bbox"]["y1"] == 20.0
        assert detection["bbox"]["x2"] == 80.0
        assert detection["bbox"]["y2"] == 90.0

        # Verify Gemini was called exactly once.
        mock_gemini.detect.assert_called_once()

        # Verify the database repository was called.
        mock_repository.create_detection.assert_called_once()

        # Inspect database call.
        call_kwargs = (
            mock_repository.create_detection.call_args.kwargs
        )

        assert call_kwargs["user_id"] == "test-user-id"
        assert call_kwargs["image_path"] == "road.jpg"
        assert call_kwargs["detection_count"] == 1

        assert call_kwargs["detections"] == [
            {
                "class_name": "pothole",
                "confidence": 0.95,
                "bbox": {
                    "x1": 10.0,
                    "y1": 20.0,
                    "x2": 80.0,
                    "y2": 90.0,
                },
            }
        ]

    finally:
        app.dependency_overrides.clear()