from unittest.mock import MagicMock, patch

from app.api.dependencies import get_detection_service
from app.services.detection_service import DetectionService


@patch("app.api.dependencies.GeminiDetector")
def test_detection_service_uses_gemini(mock_gemini):
    # Clear the dependency cache so the patched GeminiDetector
    # is actually instantiated during this test.
    get_detection_service.cache_clear()

    mock_detector = MagicMock()
    mock_gemini.return_value = mock_detector

    service = get_detection_service()

    assert isinstance(service, DetectionService)
    mock_gemini.assert_called_once()
    assert service.detector is mock_detector


def test_detection_service_dependency_is_gemini():
    # Clear any previously cached detector.
    get_detection_service.cache_clear()

    with patch(
        "app.api.dependencies.GeminiDetector"
    ) as mock_gemini:
        mock_detector = MagicMock()
        mock_gemini.return_value = mock_detector

        service = get_detection_service()

        assert isinstance(service, DetectionService)
        assert service.detector is mock_detector
        mock_gemini.assert_called_once()