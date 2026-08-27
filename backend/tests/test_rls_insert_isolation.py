import os

import pytest
from dotenv import load_dotenv
from supabase import create_client

from app.core.supabase import get_authenticated_client

load_dotenv()


def get_authenticated_test_client(email_env, password_env):
    auth_client = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_KEY"),
    )

    login = auth_client.auth.sign_in_with_password(
        {
            "email": os.getenv(email_env),
            "password": os.getenv(password_env),
        }
    )

    assert login.user is not None
    assert login.session is not None

    return (
        login.user.id,
        get_authenticated_client(login.session.access_token),
    )


def test_user_cannot_insert_detection_for_another_user():
    user_a_id, client_a = get_authenticated_test_client(
        "TEST_EMAIL",
        "TEST_PASSWORD",
    )

    user_b_id, _ = get_authenticated_test_client(
        "TEST1_EMAIL",
        "TEST1_PASSWORD",
    )

    assert user_a_id != user_b_id

    detection = {
        "user_id": user_b_id,
        "image_path": "security-test/unauthorized.jpg",
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

    with pytest.raises(Exception):
        (
            client_a
            .table("detections")
            .insert(detection)
            .execute()
        )