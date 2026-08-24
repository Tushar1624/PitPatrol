from typing import Any

from app.core.supabase import get_authenticated_client


class DetectionRepository:
    def __init__(self, access_token: str):
        self.supabase = get_authenticated_client(access_token)

    def create_detection(
        self,
        user_id: str,
        image_path: str | None,
        detection_count: int,
        detections: list[dict[str, Any]],
    ):
        response = (
            self.supabase
            .table("detections")
            .insert(
                {
                    "user_id": user_id,
                    "image_path": image_path,
                    "detection_count": detection_count,
                    "detections": detections,
                }
            )
            .execute()
        )

        return response.data