from unittest.mock import MagicMock, patch

from app.api.dependencies import get_detection_service
from app.services.detection_service import DetectionService


def test_gemini_is_active_detector():
    """
    Verify that the application's detection service
    is configured to use GeminiDetector.
    """

    # Clear the cached service so the test creates it fresh.
    get_detection_service.cache_clear()

    with patch(
        "app.api.dependencies.GeminiDetector"
    ) as mock_gemini:

        mock_detector = MagicMock()
        mock_gemini.return_value = mock_detector

        service = get_detection_service()

        assert isinstance(service, DetectionService)

        mock_gemini.assert_called_once()

        assert service.detector is mock_detector

    # Prevent this test from affecting other tests.
    get_detection_service.cache_clear()