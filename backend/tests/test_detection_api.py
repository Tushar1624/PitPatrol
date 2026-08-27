from io import BytesIO
from unittest.mock import MagicMock, patch
from types import SimpleNamespace
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
from app.api import detection

client = TestClient(app)

class FakeDetectionService:

    def detect_and_save(
        self,
        image,
        user_id,
        access_token,
        image_path=None,
    ):
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


def test_detect_requires_authentication():
    response = client.post(
        "/api/detect",
        files={
            "image": (
                "test.jpg",
                create_test_image(),
                "image/jpeg",
            )
        },
    )

    print("\nSTATUS:", response.status_code)
    print("BODY:", response.json())

    assert response.status_code in (401, 403)

def test_detect_authenticated():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )
    app.dependency_overrides[get_detection_service] = (
    lambda: FakeDetectionService()
)
    try:
        response = client.post(
    "/api/detect",
    headers={
        "Authorization": "Bearer test-access-token",
    },
    files={
        "image": (
            "test.jpg",
            create_test_image(),
            "image/jpeg",
        )
    },
)

        print("\nSTATUS:", response.status_code)
        print("BODY:", response.json())

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

    finally:
        app.dependency_overrides.clear()

def test_detect_rejects_invalid_image():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )

    try:
        response = client.post(
    "/api/detect",
    headers={
        "Authorization": "Bearer test-access-token",
    },
    files={
        "image": (
            "broken.jpg",
            b"this is not a real image",
            "image/jpeg",
        )
    },
)

        assert response.status_code == 400

    finally:
        app.dependency_overrides.clear()

def test_detect_rejects_invalid_token():
    response = client.post(
        "/api/detect",
        headers={
            "Authorization": "Bearer definitely-invalid-token",
        },
        files={
            "image": (
                "test.jpg",
                create_test_image(),
                "image/jpeg",
            )
        },
    )

    assert response.status_code == 401

def test_detect_rejects_unsupported_file_type():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )

    try:
        response = client.post(
            "/api/detect",
            headers={
                "Authorization": "Bearer test-access-token",
            },
            files={
                "image": (
                    "test.txt",
                    b"not an image",
                    "text/plain",
                )
            },
        )

        assert response.status_code == 400

        body = response.json()
        assert "Unsupported image type" in body["detail"]

    finally:
        app.dependency_overrides.clear()

def test_detect_returns_500_when_gemini_fails():
    fake_user = SimpleNamespace(
        id="test-user-id",
    )

    failing_service = MagicMock()
    failing_service.detect_and_save.side_effect = RuntimeError(
        "Gemini API request failed"
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )
    app.dependency_overrides[get_detection_service] = (
        lambda: failing_service
    )

    try:
        response = client.post(
            "/api/detect",
            headers={
                "Authorization": "Bearer test-access-token",
            },
            files={
                "image": (
                    "test.jpg",
                    create_test_image(),
                    "image/jpeg",
                )
            },
        )

        assert response.status_code == 500

        body = response.json()
        assert body["detail"] == (
    "Detection failed. Please try again later."
)
        assert "Gemini API request failed" not in body["detail"]

        failing_service.detect_and_save.assert_called_once()

    finally:
        app.dependency_overrides.clear()