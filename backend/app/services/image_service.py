from io import BytesIO

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


class ImageProcessingError(Exception):
    """Raised when an uploaded image is invalid."""


async def process_upload(file: UploadFile) -> Image.Image:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ImageProcessingError(
            "Unsupported image type. "
            "Allowed types: JPEG, PNG, WebP."
        )

    data = await file.read()

    if not data:
        raise ImageProcessingError("Uploaded image is empty.")

    if len(data) > MAX_IMAGE_SIZE:
        raise ImageProcessingError(
            "Image exceeds the maximum size of 10 MB."
        )

    try:
        image = Image.open(BytesIO(data))
        image.load()
    except UnidentifiedImageError:
        raise ImageProcessingError(
            "Uploaded file is not a valid image."
        )

    return image.convert("RGB")