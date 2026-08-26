import json
import os

from google import genai
from google.genai import types
from PIL import Image

from app.ai.detector import Detector
from app.schemas.detection import (
    BoundingBox,
    Detection,
    DetectionResponse,
)


def convert_bbox_to_pixels(
    bbox: dict,
    image_width: int,
    image_height: int,
) -> dict:
    """
    Convert Gemini's 0-1000 normalized bounding-box
    coordinates into actual image pixel coordinates.
    """

    x1 = (bbox["x1"] / 1000.0) * image_width
    y1 = (bbox["y1"] / 1000.0) * image_height
    x2 = (bbox["x2"] / 1000.0) * image_width
    y2 = (bbox["y2"] / 1000.0) * image_height

    # Keep coordinates inside image boundaries.
    x1 = max(0.0, min(x1, float(image_width)))
    y1 = max(0.0, min(y1, float(image_height)))
    x2 = max(0.0, min(x2, float(image_width)))
    y2 = max(0.0, min(y2, float(image_height)))

    return {
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
    }


class GeminiDetector(Detector):

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured"
            )

        if not model:
            raise RuntimeError(
                "GEMINI_MODEL is not configured"
            )

        self.model = model
        self.client = genai.Client(api_key=api_key)

    def detect(self, image: Image.Image) -> DetectionResponse:

        prompt = """
Analyze this road image for potholes.

Return ONLY valid JSON in exactly this format:

{
  "detections": [
    {
      "class_name": "pothole",
      "confidence": 0.0,
      "bbox": {
        "x1": 0,
        "y1": 0,
        "x2": 0,
        "y2": 0
      }
    }
  ],
  "detection_count": 0
}

Rules:

- Detect only visible potholes.
- class_name must be exactly "pothole".
- confidence must be between 0 and 1.
- Bounding-box coordinates must be normalized to a 0-1000 coordinate system.
- x1 and x2 represent horizontal coordinates.
- y1 and y2 represent vertical coordinates.
- x1 < x2.
- y1 < y2.
- If there are no potholes, return an empty detections array.
- detection_count must equal the number of detections.
- Do not include markdown.
- Do not include explanations.
"""

        # ---------------------------------------------------------
        # 1. Call Gemini
        # ---------------------------------------------------------

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[image, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )

        except TimeoutError as exc:
            raise RuntimeError(
                "Gemini API request timed out"
            ) from exc

        except Exception as exc:
            error_message = str(exc).upper()

            if (
                "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
                or "RATE LIMIT" in error_message
            ):
                raise RuntimeError(
                    "Gemini API rate limit exceeded"
                ) from exc

            if (
                "401" in error_message
                or "UNAUTHENTICATED" in error_message
                or "INVALID API KEY" in error_message
                or "INVALID_API_KEY" in error_message
            ):
                raise RuntimeError(
                    "Gemini API authentication failed"
                ) from exc

            if (
                "503" in error_message
                or "SERVICE_UNAVAILABLE" in error_message
            ):
                raise RuntimeError(
                    "Gemini service is unavailable"
                ) from exc

            raise RuntimeError(
                "Gemini API request failed"
            ) from exc

        # ---------------------------------------------------------
        # 2. Extract Gemini response
        # ---------------------------------------------------------

        text = getattr(response, "text", None)

        if not text or not text.strip():
            raise RuntimeError(
                "Gemini returned an empty response"
            )

        text = text.strip()

        # Handle accidental markdown fences.
        if text.startswith("```"):
            text = text.replace("```json", "", 1)
            text = text.replace("```", "")
            text = text.strip()

        # ---------------------------------------------------------
        # 3. Parse JSON
        # ---------------------------------------------------------

        try:
            data = json.loads(text)

        except json.JSONDecodeError as exc:
            raise ValueError(
                "Gemini returned invalid JSON"
            ) from exc

        # ---------------------------------------------------------
        # 4. Validate top-level structure
        # ---------------------------------------------------------

        if not isinstance(data, dict):
            raise ValueError(
                "Gemini returned an invalid detection structure"
            )

        if "detections" not in data:
            raise ValueError(
                "Gemini returned an invalid detection structure"
            )

        if not isinstance(data["detections"], list):
            raise ValueError(
                "Gemini returned an invalid detection structure"
            )

        # ---------------------------------------------------------
        # 5. Validate and convert detections
        # ---------------------------------------------------------

        detections: list[Detection] = []

        for item in data["detections"]:

            if not isinstance(item, dict):
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            if item.get("class_name") != "pothole":
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            confidence = item.get("confidence")

            if not isinstance(confidence, (int, float)):
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            if not 0 <= confidence <= 1:
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            bbox = item.get("bbox")

            if not isinstance(bbox, dict):
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            x1 = bbox.get("x1")
            y1 = bbox.get("y1")
            x2 = bbox.get("x2")
            y2 = bbox.get("y2")

            if not all(
                isinstance(value, (int, float))
                for value in (x1, y1, x2, y2)
            ):
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            if x1 >= x2 or y1 >= y2:
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            converted_bbox = convert_bbox_to_pixels(
                bbox=bbox,
                image_width=image.width,
                image_height=image.height,
            )

            # Make sure conversion didn't collapse the box.
            if (
                converted_bbox["x1"] >= converted_bbox["x2"]
                or converted_bbox["y1"] >= converted_bbox["y2"]
            ):
                raise ValueError(
                    "Gemini returned an invalid detection structure"
                )

            detections.append(
                Detection(
                    class_name="pothole",
                    confidence=confidence,
                    bbox=BoundingBox(
                        x1=converted_bbox["x1"],
                        y1=converted_bbox["y1"],
                        x2=converted_bbox["x2"],
                        y2=converted_bbox["y2"],
                    ),
                )
            )

        # ---------------------------------------------------------
        # 6. Validate detection_count AFTER processing all items
        # ---------------------------------------------------------

        reported_count = data.get("detection_count")

        if not isinstance(reported_count, int):
            raise ValueError(
                "Gemini detection_count does not match detections"
            )

        if reported_count != len(detections):
            raise ValueError(
                "Gemini detection_count does not match detections"
            )

        # ---------------------------------------------------------
        # 7. Return final validated response
        # ---------------------------------------------------------

        return DetectionResponse(
            detections=detections,
            detection_count=len(detections),
        )