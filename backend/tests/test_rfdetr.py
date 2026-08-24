from PIL import Image

from app.ai.rfdetr_detector import RFDETRDetector


def test_rfdetr_detector():
    image = Image.new(
        "RGB",
        (640, 480),
        "white",
    )

    detector = RFDETRDetector()

    result = detector.detect(image)

    assert result is not None
    assert result.detection_count == len(result.detections)

    for detection in result.detections:
        assert 0.0 <= detection.confidence <= 1.0
        assert detection.bbox.x1 <= detection.bbox.x2
        assert detection.bbox.y1 <= detection.bbox.y2