from unittest.mock import MagicMock

from app.services.detection_repository import DetectionRepository


def test_create_detection():
    repository = object.__new__(DetectionRepository)

    mock_supabase = MagicMock()
    repository.supabase = mock_supabase

    mock_response = MagicMock()
    mock_response.data = [
        {
            "id": 3,
            "user_id": "test-user",
            "image_path": "test/test-image.jpg",
            "detection_count": 1,
            "detections": [
                {
                    "class_name": "pothole",
                    "confidence": 0.95,
                    "bbox": {
                        "x1": 10,
                        "y1": 20,
                        "x2": 100,
                        "y2": 120,
                    },
                }
            ],
        }
    ]

    (
        mock_supabase
        .table.return_value
        .insert.return_value
        .execute.return_value
    ) = mock_response

    result = repository.create_detection(
        user_id="test-user",
        image_path="test/test-image.jpg",
        detection_count=1,
        detections=[
            {
                "class_name": "pothole",
                "confidence": 0.95,
                "bbox": {
                    "x1": 10,
                    "y1": 20,
                    "x2": 100,
                    "y2": 120,
                },
            }
        ],
    )

    assert result == mock_response.data

    mock_supabase.table.assert_called_once_with(
        "detections"
    )