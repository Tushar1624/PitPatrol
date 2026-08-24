from io import BytesIO

import pytest
from fastapi import UploadFile
from PIL import Image

from app.services.image_service import (
    ImageProcessingError,
    process_upload,
)


def create_image_file(
    format: str = "JPEG",
    filename: str = "test.jpg",
):
    image = Image.new(
        "RGB",
        (100, 100),
        "white",
    )

    buffer = BytesIO()
    image.save(buffer, format=format)
    buffer.seek(0)

    return UploadFile(
        filename=filename,
        file=buffer,
        size=buffer.getbuffer().nbytes,
        headers={
            "content-type": f"image/{format.lower()}",
        },
    )


@pytest.mark.anyio
async def test_process_valid_jpeg():
    file = create_image_file("JPEG")

    image = await process_upload(file)

    assert image.format == "JPEG" or image.format is None
    assert image.mode == "RGB"
    assert image.size == (100, 100)


@pytest.mark.anyio
async def test_process_valid_png():
    file = create_image_file("PNG", "test.png")

    image = await process_upload(file)

    assert image.mode == "RGB"
    assert image.size == (100, 100)


@pytest.mark.anyio
async def test_reject_unsupported_type():
    file = UploadFile(
        filename="test.txt",
        file=BytesIO(b"not an image"),
        headers={
            "content-type": "text/plain",
        },
    )

    with pytest.raises(ImageProcessingError):
        await process_upload(file)


@pytest.mark.anyio
async def test_reject_empty_file():
    file = UploadFile(
        filename="empty.jpg",
        file=BytesIO(),
        headers={
            "content-type": "image/jpeg",
        },
    )

    with pytest.raises(ImageProcessingError):
        await process_upload(file)


@pytest.mark.anyio
async def test_reject_invalid_image():
    file = UploadFile(
        filename="fake.jpg",
        file=BytesIO(b"this is not an image"),
        headers={
            "content-type": "image/jpeg",
        },
    )

    with pytest.raises(ImageProcessingError):
        await process_upload(file)