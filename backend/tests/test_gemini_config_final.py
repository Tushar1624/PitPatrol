import os
from unittest.mock import patch

import pytest

from app.ai.gemini_detector import GeminiDetector


def test_gemini_configuration_is_loaded():
    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": "test-model",
        },
        clear=True,
    ):
        with patch(
            "app.ai.gemini_detector.genai.Client"
        ) as mock_client:

            detector = GeminiDetector()

            assert detector.model == "test-model"

            mock_client.assert_called_once_with(
                api_key="test-api-key"
            )


def test_gemini_requires_api_key():
    with patch.dict(
        os.environ,
        {
            "GEMINI_MODEL": "test-model",
        },
        clear=True,
    ):
        with pytest.raises(
            RuntimeError,
            match="GEMINI_API_KEY is not configured",
        ):
            GeminiDetector()


def test_gemini_requires_model():
    with patch.dict(
        os.environ,
        {
            "GEMINI_API_KEY": "test-api-key",
        },
        clear=True,
    ):
        with pytest.raises(
            RuntimeError,
            match="GEMINI_MODEL is not configured",
        ):
            GeminiDetector()