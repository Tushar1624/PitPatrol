from supabase import Client


class HistoryService:

    @staticmethod
    def get_history(client: Client):
        response = (
            client
            .table("detections")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return response.data

    @staticmethod
    def get_history_by_id(client: Client, detection_id: int):
        response = (
            client
            .table("detections")
            .select("*")
            .eq("id", detection_id)
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]