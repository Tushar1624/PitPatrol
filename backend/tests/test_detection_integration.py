from io import BytesIO

from PIL import Image

from app.ai.rfdetr_detector import RFDETRDetector


def create_test_image():
    image = Image.new(
        "RGB",
        (640, 640),
        color="white",
    )

    buffer = BytesIO()

    image.save(
        buffer,
        format="JPEG",
    )

    buffer.seek(0)

    return Image.open(buffer).convert("RGB")


def test_real_rfdetr_detection():
    detector = RFDETRDetector()

    image = create_test_image()

    result = detector.detect(image)

    assert result is not None
    assert result.detection_count >= 0
    assert isinstance(result.detections, list)

    for detection in result.detections:
        assert detection.class_name
        assert 0.0 <= detection.confidence <= 1.0

        assert detection.bbox.x1 >= 0
        assert detection.bbox.y1 >= 0
        assert detection.bbox.x2 >= detection.bbox.x1
        assert detection.bbox.y2 >= detection.bbox.y1