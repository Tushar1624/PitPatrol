from unittest.mock import MagicMock

import pytest
from PIL import Image

from app.schemas.detection import (
    BoundingBox,
    Detection,
    DetectionResponse,
)
from app.services.detection_service import DetectionService


def create_test_image():
    return Image.new("RGB", (100, 100), "white")


def test_detection_service_propagates_gemini_error():
    detector = MagicMock()

    detector.detect.side_effect = RuntimeError(
        "Gemini API rate limit exceeded"
    )

    service = DetectionService(detector=detector)

    with pytest.raises(
        RuntimeError,
        match="Gemini API rate limit exceeded",
    ):
        service.detect(create_test_image())


def test_detection_service_propagates_authentication_error():
    detector = MagicMock()

    detector.detect.side_effect = RuntimeError(
        "Gemini API authentication failed"
    )

    service = DetectionService(detector=detector)

    with pytest.raises(
        RuntimeError,
        match="Gemini API authentication failed",
    ):
        service.detect(create_test_image())


def test_detection_service_returns_gemini_result():
    expected_result = DetectionResponse(
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

    detector = MagicMock()
    detector.detect.return_value = expected_result

    service = DetectionService(detector=detector)

    result = service.detect(create_test_image())

    assert result == expected_result
    detector.detect.assert_called_once()