from abc import ABC, abstractmethod

from PIL import Image

from app.schemas.detection import DetectionResponse


class Detector(ABC):

    @abstractmethod
    def detect(self, image: Image.Image) -> DetectionResponse:
        """Run object detection on an image."""
        raise NotImplementedError