import os

from PIL import Image
from rfdetr import RFDETRSmall

from app.ai.detector import Detector
from app.schemas.detection import (
    BoundingBox,
    Detection,
    DetectionResponse,
)


class RFDETRDetector(Detector):
    def __init__(self, weights_path: str | None = None):
        weights_path = weights_path or os.getenv(
            "RFDETR_WEIGHTS_PATH"
        )

        if weights_path:
            self.model = RFDETRSmall(
                pretrain_weights=weights_path
            )
        else:
            self.model = RFDETRSmall()

    def detect(self, image: Image.Image) -> DetectionResponse:
        detections = self.model.predict(image)

        results = []

        for class_id, confidence, box in zip(
            detections.class_id,
            detections.confidence,
            detections.xyxy,
        ):
            class_name = self.model.class_names.get(
                int(class_id),
                str(class_id),
            )

            results.append(
                Detection(
                    class_name=class_name,
                    confidence=float(confidence),
                    bbox=BoundingBox(
                        x1=float(box[0]),
                        y1=float(box[1]),
                        x2=float(box[2]),
                        y2=float(box[3]),
                    ),
                )
            )

        return DetectionResponse(
            detections=results,
            detection_count=len(results),
        )