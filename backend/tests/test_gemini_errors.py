import os

import pytest
from PIL import Image
from unittest.mock import MagicMock, patch

from app.ai.gemini_detector import GeminiDetector


def create_test_image():
    return Image.new("RGB", (100, 100), color="white")


def create_detector(mock_client):
    mock_client_instance = MagicMock()
    mock_client.return_value = mock_client_instance

    return mock_client_instance


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_timeout(mock_client):
    mock_client_instance = create_detector(mock_client)

    mock_client_instance.models.generate_content.side_effect = TimeoutError(
        "Gemini request timed out"
    )

    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            RuntimeError,
            match="Gemini API request timed out",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_rate_limit(mock_client):
    mock_client_instance = create_detector(mock_client)

    mock_client_instance.models.generate_content.side_effect = Exception(
        "429 RESOURCE_EXHAUSTED"
    )

    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            RuntimeError,
            match="Gemini API rate limit exceeded",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_authentication_failure(mock_client):
    mock_client_instance = create_detector(mock_client)

    mock_client_instance.models.generate_content.side_effect = Exception(
        "401 UNAUTHENTICATED"
    )

    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "invalid-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            RuntimeError,
            match="Gemini API authentication failed",
        ):
            detector.detect(create_test_image())


@patch("app.ai.gemini_detector.genai.Client")
def test_gemini_service_unavailable(mock_client):
    mock_client_instance = create_detector(mock_client)

    mock_client_instance.models.generate_content.side_effect = Exception(
        "503 SERVICE_UNAVAILABLE"
    )

    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
    ):
        detector = GeminiDetector()

        with pytest.raises(
            RuntimeError,
            match="Gemini service is unavailable",
        ):
            detector.detect(create_test_image())