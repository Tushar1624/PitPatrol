from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image

from app.ai.gemini_detector import GeminiDetector
from app.api import detection


def create_test_image():
    image = Image.new(
        "RGB",
        (100, 100),
        "white",
    )

    return image


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_detector_sends_image(mock_client):
    mock_response = MagicMock()
    mock_response.text = """
{
  "detections": [
    {
      "class_name": "pothole",
      "confidence": 0.95,
      "bbox": {
        "x1": 100,
        "y1": 200,
        "x2": 800,
        "y2": 900
      }
    }
  ],
  "detection_count": 1
}
"""

    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )

    mock_client.return_value = mock_client_instance

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        result = detector.detect(
            create_test_image()
        )

    mock_client_instance.models.generate_content.assert_called_once()

    assert result.detection_count == 1
    assert len(result.detections) == 1

    detection = result.detections[0]

    assert detection.class_name == "pothole"
    assert detection.confidence == 0.95

    assert detection.bbox.x1 == 10.0
    assert detection.bbox.y1 == 20.0
    assert detection.bbox.x2 == 80.0
    assert detection.bbox.y2 == 90.0


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_detector_rejects_empty_response(mock_client):
    mock_response = MagicMock()
    mock_response.text = None

    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )

    mock_client.return_value = mock_client_instance

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            RuntimeError,
            match="Gemini returned an empty response",
        ):
            detector.detect(
                create_test_image()
            )


def test_gemini_detector_requires_api_key():
    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "",
            "GEMINI_MODEL": "test-model",
        },
    ):
        with pytest.raises(
            RuntimeError,
            match="GEMINI_API_KEY is not configured",
        ):
            GeminiDetector()


def test_gemini_detector_requires_model():
    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "",
        },
    ):
        with pytest.raises(
            RuntimeError,
            match="GEMINI_MODEL is not configured",
        ):
            GeminiDetector()

@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_detector_rejects_missing_detections(mock_client):
    mock_response = MagicMock()
    mock_response.text = """
{
  "detection_count": 0
}
"""

    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )

    mock_client.return_value = mock_client_instance

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
            match="Gemini returned an invalid detection structure",
        ):
            detector.detect(create_test_image())

@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_detector_rejects_invalid_detections_type(
    mock_client,
):
    mock_response = MagicMock()
    mock_response.text = """
{
  "detections": "not-a-list",
  "detection_count": 1
}
"""

    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )

    mock_client.return_value = mock_client_instance

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
            match="Gemini returned an invalid detection structure",
        ):
            detector.detect(create_test_image())
@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_detector_converts_bbox_to_pixels(mock_client):
    mock_response = MagicMock()

    mock_response.text = """
    {
      "detections": [
        {
          "class_name": "pothole",
          "confidence": 0.95,
          "bbox": {
            "x1": 100,
            "y1": 200,
            "x2": 600,
            "y2": 800
          }
        }
      ],
      "detection_count": 1
    }
    """

    mock_client_instance = MagicMock()

    mock_client_instance.models.generate_content.return_value = (
        mock_response
    )

    mock_client.return_value = mock_client_instance

    with patch.dict(
        "os.environ",
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        # 1000 x 500 image
        image = Image.new(
            "RGB",
            (1000, 500),
            "white",
        )

        result = detector.detect(image)

    assert result.detection_count == 1

    bbox = result.detections[0].bbox

    assert bbox.x1 == 100.0
    assert bbox.y1 == 100.0
    assert bbox.x2 == 600.0
    assert bbox.y2 == 400.0