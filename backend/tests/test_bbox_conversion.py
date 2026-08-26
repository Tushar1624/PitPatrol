from app.ai.gemini_detector import convert_bbox_to_pixels


def test_convert_bbox_to_pixels():
    bbox = {
        "x1": 100,
        "y1": 200,
        "x2": 600,
        "y2": 800,
    }

    result = convert_bbox_to_pixels(
        bbox=bbox,
        image_width=1000,
        image_height=500,
    )

    assert result["x1"] == 100.0
    assert result["y1"] == 100.0
    assert result["x2"] == 600.0
    assert result["y2"] == 400.0


def test_convert_bbox_full_image():
    bbox = {
        "x1": 0,
        "y1": 0,
        "x2": 1000,
        "y2": 1000,
    }

    result = convert_bbox_to_pixels(
        bbox=bbox,
        image_width=800,
        image_height=600,
    )

    assert result["x1"] == 0.0
    assert result["y1"] == 0.0
    assert result["x2"] == 800.0
    assert result["y2"] == 600.0


def test_convert_bbox_clamps_values():
    bbox = {
        "x1": -100,
        "y1": 100,
        "x2": 1200,
        "y2": 900,
    }

    result = convert_bbox_to_pixels(
        bbox=bbox,
        image_width=800,
        image_height=600,
    )

    assert result["x1"] == 0.0
    assert result["y1"] == 60.0
    assert result["x2"] == 800.0
    assert result["y2"] == 540.0