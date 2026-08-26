from io import BytesIO
from types import SimpleNamespace
from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from PIL import Image

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


def test_complete_detect_gemini_database_flow():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    # ---------------------------------------------------------
    # Mock Gemini
    # ---------------------------------------------------------

    mock_gemini = MagicMock()

    mock_gemini.detect.return_value = DetectionResponse(
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

    # ---------------------------------------------------------
    # Mock database repository
    # ---------------------------------------------------------

    mock_repository = MagicMock()

    mock_repository.create_detection.return_value = [
        {
            "id": "test-detection-id",
        }
    ]

    # ---------------------------------------------------------
    # Use the REAL DetectionService
    # ---------------------------------------------------------

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
        # -----------------------------------------------------
        # Call the REAL API endpoint
        # -----------------------------------------------------

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

        # -----------------------------------------------------
        # Verify HTTP response
        # -----------------------------------------------------

        assert response.status_code == 200

        body = response.json()

        assert body["detection_count"] == 1
        assert len(body["detections"]) == 1

        detection = body["detections"][0]

        assert detection["class_name"] == "pothole"
        assert detection["confidence"] == 0.95

        assert detection["bbox"]["x1"] == 10.0
        assert detection["bbox"]["y1"] == 20.0
        assert detection["bbox"]["x2"] == 80.0
        assert detection["bbox"]["y2"] == 90.0

        # -----------------------------------------------------
        # Verify Gemini was actually invoked
        # -----------------------------------------------------

        mock_gemini.detect.assert_called_once()

        # -----------------------------------------------------
        # Verify database save happened
        # -----------------------------------------------------

        mock_repository.create_detection.assert_called_once()

        db_call = (
            mock_repository
            .create_detection
            .call_args
            .kwargs
        )

        assert db_call["user_id"] == "test-user-id"
        assert db_call["image_path"] == "road.jpg"
        assert db_call["detection_count"] == 1

        assert db_call["detections"] == [
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