import os

from dotenv import load_dotenv
from supabase import create_client

from app.core.supabase import get_authenticated_client

load_dotenv()


def test_authenticated_database_access():
    auth_client = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_KEY"),
    )

    login = auth_client.auth.sign_in_with_password(
        {
            "email": os.getenv("TEST_EMAIL"),
            "password": os.getenv("TEST_PASSWORD"),
        }
    )

    assert login.user is not None
    assert login.session is not None

    print("\nAuthenticated user:", login.user.id)

    token = login.session.access_token

    client = get_authenticated_client(token)

    response = (
        client
        .table("detections")
        .select("*")
        .execute()
    )

    print("Database response:", response.data)

    assert response.data