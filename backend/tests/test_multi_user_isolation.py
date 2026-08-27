import os

from dotenv import load_dotenv
from supabase import create_client

from app.core.supabase import get_authenticated_client

load_dotenv()


def get_user_client(email_env: str, password_env: str):
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


def test_multi_user_detection_isolation():
    user_a_id, client_a = get_user_client(
        "TEST_EMAIL",
        "TEST_PASSWORD",
    )

    user_b_id, client_b = get_user_client(
        "TEST1_EMAIL",
        "TEST1_PASSWORD",
    )

    assert user_a_id != user_b_id

    response_a = (
        client_a
        .table("detections")
        .select("id,user_id")
        .execute()
    )

    response_b = (
        client_b
        .table("detections")
        .select("id,user_id")
        .execute()
    )

    records_a = response_a.data
    records_b = response_b.data

    assert records_a
    assert records_b

    # User A must see only User A's records.
    assert all(
        record["user_id"] == user_a_id
        for record in records_a
    )

    # User B must see only User B's records.
    assert all(
        record["user_id"] == user_b_id
        for record in records_b
    )

    ids_a = {record["id"] for record in records_a}
    ids_b = {record["id"] for record in records_b}

    # Neither user may see the other's detection records.
    assert ids_a.isdisjoint(ids_b)