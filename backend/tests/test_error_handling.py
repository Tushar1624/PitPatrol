from io import BytesIO
from types import SimpleNamespace

from fastapi.testclient import TestClient
from PIL import Image

from app.api.dependencies import get_detection_service
from app.core.auth import get_current_user
from app.main import app


client = TestClient(app)


def create_test_image():
    image = Image.new("RGB", (100, 100), "white")

    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)

    return buffer


class FailingDetectionService:

    def detect_and_save(
        self,
        image,
        user_id,
        access_token,
        image_path=None,
    ):
        raise RuntimeError(
            "SECRET_INTERNAL_DATABASE_ERROR"
        )


def test_detection_does_not_leak_internal_exception():
    fake_user = SimpleNamespace(id="test-user-id")

    app.dependency_overrides[get_current_user] = (
        lambda: fake_user
    )

    app.dependency_overrides[get_detection_service] = (
        lambda: FailingDetectionService()
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

        assert "SECRET_INTERNAL_DATABASE_ERROR" not in response.text

    finally:
        app.dependency_overrides.clear()