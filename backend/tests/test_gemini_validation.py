import json
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image

from app.ai.gemini_detector import GeminiDetector


def create_test_image():
    return Image.new("RGB", (100, 100), "white")


def create_detector(mock_client):
    mock_client_instance = MagicMock()
    mock_client.return_value = mock_client_instance
    return mock_client_instance


def set_valid_response(mock_client_instance, data):
    mock_response = MagicMock()
    mock_response.text = json.dumps(data)

    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )


def valid_detection():
    return {
        "class_name": "pothole",
        "confidence": 0.95,
        "bbox": {
            "x1": 10,
            "y1": 20,
            "x2": 80,
            "y2": 90,
        },
    }


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_invalid_class_name(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [
                {
                    "class_name": "car",
                    "confidence": 0.95,
                    "bbox": {
                        "x1": 10,
                        "y1": 20,
                        "x2": 80,
                        "y2": 90,
                    },
                }
            ],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_confidence_below_zero(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [
                {
                    "class_name": "pothole",
                    "confidence": -0.1,
                    "bbox": {
                        "x1": 10,
                        "y1": 20,
                        "x2": 80,
                        "y2": 90,
                    },
                }
            ],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_confidence_above_one(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [
                {
                    "class_name": "pothole",
                    "confidence": 1.5,
                    "bbox": {
                        "x1": 10,
                        "y1": 20,
                        "x2": 80,
                        "y2": 90,
                    },
                }
            ],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_invalid_bbox_order(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [
                {
                    "class_name": "pothole",
                    "confidence": 0.95,
                    "bbox": {
                        "x1": 80,
                        "y1": 90,
                        "x2": 10,
                        "y2": 20,
                    },
                }
            ],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_missing_bbox(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [
                {
                    "class_name": "pothole",
                    "confidence": 0.95,
                }
            ],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_missing_confidence(mock_client):
    mock_client_instance = create_detector(mock_client)

    detection = valid_detection()
    del detection["confidence"]

    set_valid_response(
        mock_client_instance,
        {
            "detections": [detection],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="invalid detection structure",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rejects_invalid_detection_count(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [valid_detection()],
            "detection_count": 5,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            ValueError,
            match="detection_count",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_accepts_valid_detection(mock_client):
    mock_client_instance = create_detector(mock_client)

    set_valid_response(
        mock_client_instance,
        {
            "detections": [valid_detection()],
            "detection_count": 1,
        },
    )

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        result = detector.detect(create_test_image())

    assert result.detection_count == 1
    assert len(result.detections) == 1
    assert result.detections[0].class_name == "pothole"
    assert result.detections[0].confidence == 0.95